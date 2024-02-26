// Retrieve email data from storage
chrome.storage.local.get(['emailData'], function (result) {
  const emailData = result.emailData;
  if (emailData && emailData.phishingSigns) {
    const phishingSigns = emailData.phishingSigns;
    const mainPhishingSign = phishingSigns[phishingSigns.length - 1]; // Get the last value

    document.getElementById('phishing-sign').innerText = mainPhishingSign;
  }
});

