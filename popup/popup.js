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

function highlightPhrases(phrases) {
  console.log(phrases)
  phrases.forEach(phrase => {
    const regex = new RegExp(phrase, 'gi');
    document.body.innerHTML = document.body.innerHTML.replace(regex, `<span style="background-color: yellow;">${phrase}</span>`);
  });
}
