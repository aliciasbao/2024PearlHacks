// write code for a chrome extension in HTML/CSS/JS that scrapes off the emails, email subject, and body of email off of an open email on a web page to query http://localhost:5000/phishing_detection with a POST request following this format: curl -X POST -d "email_subject=[email subject]" -d "emails=[email]" -d "message=[email body]". then, given the output, the last value in the array of the phishing_signs key in the JSON object outputted from the POST request is what to display in the chrome extension HTML pop, whereas all other values in the array are phrases to be highlighted on the page.

// This is the background script for the extension. It listens for the user to click the browser action and then calls a function to scrape the email and send it to the server for analysis.

// When the browser action is clicked, call the scrapeEmail function.
chrome.browserAction.onClicked.addListener(scrapeEmail);

// The scrapeEmail function scrapes the email and sends it to the server for analysis.
function scrapeEmail() {
  // Get the email subject, email body, and email addresses from the page.
  var emailSubject = getEmailSubject();
  var emailBody = getEmailBody();
  var emailAddresses = getEmailAddresses();

  // Send the email to the server for analysis.
  sendEmailToServer(emailSubject, emailBody, emailAddresses);
}

// The getEmailSubject function gets the email subject from the page.
function getEmailSubject() {
  // Get the email subject from the page.
  var emailSubject = document.title;

  // Return the email subject.
  return emailSubject;
}

// The getEmailBody function gets the email body from the page.
function getEmailBody() {
  // Get the email body from the page.
  var emailBody = document.body.innerText;

  // Return the email body.
  return emailBody;
}

// The getEmailAddresses function gets the email addresses from the page.
function getEmailAddresses() {
  // Get the email addresses from the page.
  var emailAddresses = getEmailAddressesFromText(document.body.innerText);

  // Return the email addresses.
  return emailAddresses;
}

// The getEmailAddressesFromText function gets the email addresses from the given text.
function getEmailAddressesFromText(text) {
  // Create a regular expression to match email addresses.
  var regex = /[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}/g;

  // Get the email addresses from the text.
  var emailAddresses = text.match(regex);

  // Return the email addresses.
  return emailAddresses;
}

// The sendEmailToServer function sends the email to the server for analysis.
function sendEmailToServer(emailSubject, emailBody, emailAddresses) {
  // Create a new XMLHttpRequest object.
  var xhr = new XMLHttpRequest();

  // Set up the request.
  xhr.open('POST', 'http://localhost:5000/phishing_detection', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // Set up the callback function.
  xhr.onreadystatechange = function() {
    // If the request is complete, and the response is OK, call the displayResults function.
    if (xhr.readyState == 4 && xhr.status == 200) {
      displayResults(xhr.responseText);
    }
  };

  // Send the request.
  xhr.send('email_subject=' + encodeURIComponent(emailSubject) + '&email_body=' + encodeURIComponent(emailBody) + '&email_addresses=' + encodeURIComponent(emailAddresses));
}

// The displayResults function displays the results of the analysis.
function displayResults(responseText) {
  // Parse the response text as JSON.
  var response = JSON.parse(responseText);

  // Get the phishing signs from the response.
  var phishingSigns = response.phishing_signs;

  // Get the last phishing sign.
  var lastPhishingSign = phishingSigns[phishingSigns.length - 1];

  // Highlight the phishing signs in the email body.
  highlightPhishingSigns(phishingSigns);

  // Display the last phishing sign in the browser action popup.
  chrome.browserAction.setPopup({popup: lastPhishingSign});
}

// The highlightPhishingSigns function highlights the phishing signs in the email body.
function highlightPhishingSigns(phishingSigns) {
  // Get the email body from the page.
  var emailBody = document.body.innerText;

  // Highlight each phishing sign in the email body.
  for (var i = 0; i < phishingSigns.length; i++) {
    emailBody = emailBody.replace(new RegExp(phishingSigns[i], 'g'), '<span style="background-color: #FFFF00">' + phishingSigns[i] + '</span>');
  }

  // Set the email body with the highlighted phishing signs back on the page.
  document.body.innerHTML = emailBody;
}

// Path: manifest.json
// {
//   "manifest_version": 2,
//   "name": "Phishing Detector",
//   "version": "1.0",
//   "permissions": [
//     "activeTab",
//     "tabs",
//     "http://localhost:5000/phishing_detection"
//   ],
//   "background": {
//     "scripts": ["background.js"]
//   },
//   "browser_action": {
//     "default_popup": "popup.html"
//   }
// }


