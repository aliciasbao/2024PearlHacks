// Retrieve email data from storage
document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(['emailData'], function (result) {
    const emailData = result.emailData;
    if (emailData && emailData.phishingSigns) {
      const phishingSigns = emailData.phishingSigns;
      const mainPhishingSign = phishingSigns[phishingSigns.length - 1]; // Get the last value

      const phishingSignElement = document.createElement('div');
      phishingSignElement.textContent = mainPhishingSign;
      document.getElementById('phishing-sign').appendChild(phishingSignElement);

      highlightPhrases(phishingSigns.slice(0, -1)); // Highlight all other values

      // document.getElementById('phishing-sign').innerHTML = mainPhishingSign;
    }
  });
});

chrome.onRunTime.onMessage.addListener(function(msg) {
    if (msg.action == 'callScrape'){
        let data = callScrape();
        chrome.local.storage.set({key: data});
        console.log('data stored');
    }
})

function callScrape() {
const emailSubjectElement = document.querySelector('[data-testid="email-subject"]');
  // selects text w no tags 
  const emailBodyElement = document.querySelector('.PlainText');
  console.log("email bod", emailBodyElement);
  const emailSenderElement = document.querySelector('[data-testid="email-sender"]');

  const emailSubject = emailSubjectElement ? emailSubjectElement.innerText : '';
  const emailBody = emailBodyElement ? emailBodyElement.innerText : '';
  const emailSender = emailSenderElement ? emailSenderElement.innerText : '';

  return { subject: emailSubject, body: emailBody, sender: emailSender };
}

function highlightPhrases(phrases) {
  console.log(phrases)
  phrases.forEach(phrase => {
    const regex = new RegExp(phrase, 'gi');
    document.body.innerHTML = document.body.innerHTML.replace(regex, `<span style="background-color: yellow;">${phrase}</span>`);
  });
}
