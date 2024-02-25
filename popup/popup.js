// Retrieve email data from storage
chrome.storage.local.get(['emailData'], function (result) {
  const emailData = result.emailData;
  if (emailData && emailData.phishingSigns) {
    const phishingSigns = emailData.phishingSigns;
    const mainPhishingSign = phishingSigns[phishingSigns.length - 1]; // Get the last value
    highlightPhrases(phishingSigns.slice(0, -1)); // Highlight all other values

    document.getElementById('phishing-sign').innerText = mainPhishingSign;
    
    console.log(phishingSigns.slice(0, -1))
  }
});

// function highlightPhrases(phrases) {
//   phrases = ['- Kindly share the following information', '- If you are interested', '- Reach out to Professor Jay at (769) 307-1325 via text for further details', '', 'This email could be phishing because it is requesting personal information such as full name, cell phone number, department, and year of study without providing much detail about the research project. Additionally, the email is requesting communication through text message, which is not a common method of communication for official university matters. The promise of a high weekly compensation without much work experience required could also be a red flag. This combination of requesting personal information and communication through unusual channels raises suspicions of potential phishing.']
//   console.log(phrases);
  
//   phrases.forEach(phrase => {
//     phrase = phrase.trim().replace('- ', '');
//     if (phrase !== '') {
//       const regex = new RegExp(phrase, 'gi');
//       document.body.innerHTML = document.body.innerHTML.replace(regex, `<span style="background-color: yellow;">${phrase}</span>`);
//     }
//   });
// }

function highlightPhrases(phrases) {
  // Get the current active tab
  console.log(chrome.tabs)
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    // tabs is an array of tab objects representing the currently open tabs
    // tabs[0] will be the active tab
    const activeTab = tabs[0];
    phrases = ['- Kindly share the following information', '- If you are interested', '- Reach out to Professor Jay at (769) 307-1325 via text for further details', '', 'This email could be phishing because it is requesting personal information such as full name, cell phone number, department, and year of study without providing much detail about the research project. Additionally, the email is requesting communication through text message, which is not a common method of communication for official university matters. The promise of a high weekly compensation without much work experience required could also be a red flag. This combination of requesting personal information and communication through unusual channels raises suspicions of potential phishing.']

    // Iterate through phrases
    phrases.forEach(phrase => {
      phrase = phrase.trim().replace('- ', '');
      console.log(phrase);
      if (phrase !== '') {
        const regex = new RegExp(phrase, 'gi');
        // Execute script in the context of the tab to replace text
        chrome.tabs.executeScript(activeTab.id, {
          code: `
            document.body.innerHTML = document.body.innerHTML.replace(
              ${regex}, 
              '<span style="background-color: yellow;">${phrase}</span>'
            );
          `
        });
      }
    });
  });
}

