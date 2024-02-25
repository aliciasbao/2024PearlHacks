// Listen for a click on the extension icon
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    await scrapeEmail(tabId);
    chrome.runtime.onMessage.addListener((message) => {
      sendPOSTRequest(message.emailData);
    // display(emailData);
    })

    // return { subject: emailSubject, body: emailBody, sender: emailSender };
  });

// chrome.action.onClicked.addListener(async (tab) => {
//   // Execute content script to scrape email data
//   const emailData = await scrapeEmail(tab.id);
//   // Send POST request
//   sendPOSTRequest(emailData);
// });

async function scrapeEmail(tabId) {
  chrome.runtime.sendMessage({action: 'callMethod'}, function(response) {
    console.log("Method called in popup script");
});

//   return new Promise(resolve => {
//     chrome.scripting.executeScript({
//       target: { tabId: tabId },
//       function: scrapeEmailFromPage
//     }, (results) => {
//       if (chrome.runtime.lastError) {
//         console.error(chrome.runtime.lastError.message);
//         return;
//       }
//       const emailData = results[0].result;
//       resolve(emailData);
//     });
//   });
}
//   function scrapeEmail(tabId){
//     scrapeEmailData();
//   }

//   chrome.runtime.onMessage.addListener((message) => {
//     // Check if the message contains email data
//     if (message.emailData) {
//         // Extract the email data from the message
//         const emailData = message.emailData;

//         // Send POST request or perform other actions with the email data
//         sendPOSTRequest(emailData);
//     }
// });

  
//   async function scrapeEmail(tabId) {
//     return new Promise(resolve => {
//       chrome.scripting.executeScript({
//         target: { tabId: tabId },
//         function: scrapeEmailFromPage
//       }, (results) => {
//         if (chrome.runtime.lastError) {
//           console.error(chrome.runtime.lastError.message);
//           return;
//         }
//         const emailData = results[0].result;
//         resolve(emailData);
//       });
//     });
//   }

  // function scrapeEmailFromPage() {
  //   const emailSubjectElement = document.querySelector('[data-testid="email-subject"]');
  //   const emailBodyElement = document.querySelector('[data-testid="email-body"]');
  //   const emailSenderElement = document.querySelector('[data-testid="email-sender"]');

  //   const emailSubject = emailSubjectElement ? emailSubjectElement.innerText : '';
  //   const emailBody = emailBodyElement ? emailBodyElement.innerText : '';
  //   const emailSender = emailSenderElement ? emailSenderElement.innerText : '';

  //   return { subject: emailSubject, body: emailBody, sender: emailSender };
  // }
  
  function sendPOSTRequest(emailData) {
    const url = 'http://127.0.0.1:5000/phishing_detection';
    const params = new URLSearchParams();
    params.append('email_subject', emailData.subject);
    params.append('emails', emailData.sender);
    params.append('message', emailData.body);
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Save response to storage
      chrome.storage.local.set({ emailData: data });
      
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  