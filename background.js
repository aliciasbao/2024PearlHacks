// Listen for a click on the extension icon
chrome.tabs.onUpdated.addListener(async (tabId) => {
  // Execute content script to scrape email data
  await scrapeEmail(tabId);
  console.log("scrape called");
  const data = chrome.local.storage.get(['key']);
  // Send POST request
  sendPOSTRequest(data);
  console.log("opst sent");
});

async function scrapeEmail(tabId) {
  chrome.tabs.sendMessage(tabId, {
    action: 'callScrape'
  })
  // return new Promise(resolve => {
  //   chrome.scripting.executeScript({
  //     target: { tabId: tabId },
  //     function: scrapeEmailFromPage
  //   }, (results) => {
  //     if (chrome.runtime.lastError) {
  //       console.error(chrome.runtime.lastError.message);
  //       return;
  //     }
  //     const emailData = results[0].result;
  //     resolve(emailData);
  //   });
  // });
}

// function scrapeEmailFromPage() {
//   const emailSubjectElement = document.querySelector('[data-testid="email-subject"]');
//   // selects text w no tags 
//   const emailBodyElement = document.querySelector('.PlainText');
//   console.log("email bod", emailBodyElement);
//   const emailSenderElement = document.querySelector('[data-testid="email-sender"]');

//   const emailSubject = emailSubjectElement ? emailSubjectElement.innerText : '';
//   const emailBody = emailBodyElement ? emailBodyElement.innerText : '';
//   const emailSender = emailSenderElement ? emailSenderElement.innerText : '';

//   return { subject: emailSubject, body: emailBody, sender: emailSender };
// }

function sendPOSTRequest(emailData) {
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
      chrome.storage.local.set({ emailData: response });
    })
    .catch(error => {
      console.error(error);
    });
}