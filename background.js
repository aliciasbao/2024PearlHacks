// Listen for a click on the extension icon
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.local.get(['emailData'], async function (result) {
      // Execute content script to scrape email data
      const emailData = await scrapeEmail(tabId);
      // Send POST request
      sendPOSTRequest(emailData);
      highlightPhrases(result.emailData.phishingSigns.slice(0, -1), tabId); // Highlight all other values
    }
    );
  }
});

function highlightPhrases(phrases, tabId) {
  // Get the current active tab
  console.log(chrome.tabs)
  // tabs is an array of tab objects representing the currently open tabs
  // tabs[0] will be the active tab
  // phrases = ['- Kindly share the following information', '- If you are interested', '- Reach out to Professor Jay at (769) 307-1325 via text for further details', '', 'This email could be phishing because it is requesting personal information such as full name, cell phone number, department, and year of study without providing much detail about the research project. Additionally, the email is requesting communication through text message, which is not a common method of communication for official university matters. The promise of a high weekly compensation without much work experience required could also be a red flag. This combination of requesting personal information and communication through unusual channels raises suspicions of potential phishing.']

  // Iterate through phrases
  phrases.forEach(phrase => {
    phrase = phrase.trim().replace('- ', '');
    console.log(phrase);
    console.log(tabId)
    if (phrase !== '') {
      // Execute script in the context of the tab to replace text
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: greetUser,
        args: [phrase],
      });
    }
  });
}

function greetUser(phrase) {
  console.log("replacing")
  const regex = new RegExp(phrase, 'gi');
  document.body.innerHTML = document.body.innerHTML.replace(regex, `<span style="background-color: yellow;">${phrase}</span>`);
  console.log(document.body.innerHTML)
}

async function scrapeEmail(tabId) {
  return new Promise(resolve => {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: scrapeEmailFromPage
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }
      const emailData = results[0].result;
      resolve(emailData);
    });
  });
}

function scrapeEmailFromPage() {
  const emailSubjectElement = document.querySelector('[data-testid="email-subject"]');
  const emailBodyElement = document.querySelector('[data-testid="email-body"]');
  const emailSenderElement = document.querySelector('[data-testid="email-sender"]');

  const emailSubject = emailSubjectElement ? emailSubjectElement.innerText : '';
  const emailBody = emailBodyElement ? emailBodyElement.innerText : '';
  const emailSender = emailSenderElement ? emailSenderElement.innerText : '';

  return { subject: emailSubject, body: emailBody, sender: emailSender };
}

function sendPOSTRequest(emailData) {
  console.log("sending post reauest")
  const url = 'http://127.0.0.1:5000/phishing_detection';
  const params = `email_subject=${encodeURIComponent(emailData.subject)}&emails=${encodeURIComponent(emailData.sender)}&message=${encodeURIComponent(emailData.body)}`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  })
    .then(response => response.json())
    .then(response => {
      // Save response to storage
      console.log(response)
      chrome.storage.local.set({ emailData: response });
    })
    .catch(error => {
      console.error(error);
    });
}