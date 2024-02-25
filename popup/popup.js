// Content script (content.js)
console.log('popup');
// Function to scrape email data
function scrapeEmailData() {
    const emailSubjectElement = document.querySelector('[data-testid="email-subject"]');
    console.log("subject", emailSubjectElement);
    const emailBodyElement = document.querySelectorAll('[aria-label="Message body"] [dir="ltr"]');
    console.log("body", emailBodyElement);
    const emailSenderElement = document.querySelector('[data-testid="email-sender"]');
    console.log("sender", emailSenderElement);

    const emailSubject = emailSubjectElement ? emailSubjectElement.innerText : '';
    const emailBody = emailBodyElement ? emailBodyElement.innerText : '';
    const emailSender = emailSenderElement ? emailSenderElement.innerText : '';

    const emailData = {subject: emailSubject, body: emailBody, sender: emailSender};
    chrome.runtime.sendMessage({ emailData: emailData });
    // const emailSubjectElement = document.querySelector('[data-testid="email-subject"]');
    // console.log("subject", emailSubjectElement);
    // const emailBodyElement = document.querySelectorAll('[aria-label="Message body"] [dir="ltr"]');
    // console.log("body", emailBodyElement);
    // const emailSenderElement = document.querySelector('[data-testid="email-sender"]');
    // console.log("sender", emailSenderElement);
  
    // const emailSubject = emailSubjectElement ? emailSubjectElement.innerText : '';
    // const emailBody = emailBodyElement ? emailBodyElement.innerText : '';
    // const emailSender = emailSenderElement ? emailSenderElement.innerText : '';
  
    // return { subject: emailSubject, body: emailBody, sender: emailSender };
}

chrome.runtime.onMessage.addListener(function(message){
    if (message.action=='callMethod'){
        scrapeEmailData();
    }});

// const emailData = scrapeEmailData();

//msg to background script
// chrome.runtime.sendMessage({ emailData: emailData });


// Send message to background script with scraped email data
//chrome.runtime.sendMessage({ action: 'scrapeEmailData', emailData: scrapeEmailData() });

// Retrieve email data from storage
// function display(result) {
//     const emailData = result.emailData;
//     if (emailData && emailData.phishingSigns) {
//       const phishingSigns = emailData.phishingSigns;
//       const mainPhishingSign = phishingSigns[phishingSigns.length - 1]; // Get the last value
//       console.log("main phsiing sign", mainPhishingSign);
//       document.getElementById('phishing-sign').innerHTML = mainPhishingSign;
//       highlightPhrases(phishingSigns.slice(0, -1)); // Highlight all other values
//     }
// }

chrome.storage.onChanged.addListener(function(){
    chrome.storage.local.get(['emailData'], function (result) {
        const emailData = result.emailData;
        if (emailData && emailData.phishingSigns) {
          const phishingSigns = emailData.phishingSigns;
          const mainPhishingSign = phishingSigns[phishingSigns.length - 1]; // Get the last value
          console.log("main phising sign", mainPhishingSign);
          document.getElementById('phishing-sign').innerHTML = mainPhishingSign;
          highlightPhrases(phishingSigns.slice(0, -1)); // Highlight all other values
        }
      });
});
// function display(result) {
//     const emailData = result.emailData;
//     if (emailData && emailData.phishingSigns) {
//       const phishingSigns = emailData.phishingSigns;
//       const mainPhishingSign = phishingSigns[phishingSigns.length - 1]; // Get the last value
//       console.log("main phsiing sign", mainPhishingSign);
//       document.getElementById('phishing-sign').innerHTML = mainPhishingSign;
//       highlightPhrases(phishingSigns.slice(0, -1)); // Highlight all other values
//     }
// }
  function highlightPhrases(phrases) {
    phrases.forEach(phrase => {
      const regex = new RegExp(phrase, 'gi');
      document.body.innerHTML = document.body.innerHTML.replace(regex, `<span style="background-color: yellow;">${phrase}</span>`);
    });
  }