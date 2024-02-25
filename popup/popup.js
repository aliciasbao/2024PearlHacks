// Retrieve email data from storage
chrome.storage.local.get(['emailData'], function (result) {
  const emailData = result.emailData;
  if (emailData && emailData.phishingSigns) {
    const phishingSigns = emailData.phishingSigns;
    const mainPhishingSign = phishingSigns[phishingSigns.length - 1]; // Get the last value
    document.getElementById('phishing-sign').innerText = mainPhishingSign;
    console.log(phishingSigns.slice(0, -1))
    highlightPhrases(phishingSigns.slice(0, -1)); // Highlight all other values
  }
});

function highlightPhrases(phrases) {
  console.log(phrases);
  phrases.forEach(phrase => {
    phrase = phrase.trim().replace('- ', '');
    if (phrase !== '') {
      const regex = new RegExp(phrase, 'gi');
      document.body.innerHTML = document.body.innerHTML.replace(regex, `<span style="background-color: yellow;">${phrase}</span>`);
    }
  });
}
