# 2024PearlHacks
Fish4Phish is a chrome extension that warns users against phishing emails and links. 

## Testing the API

```
cd ./phish-detection-api
pip install -r requirements.txt
python3 server.py
```

In a new terminal,
```
curl -X POST -d "email_subject=Part-time Research Opportunity for UNC Students" -d "emails=profjeffreykennedy@gmail.com" -d "message=Dear Students,

I trust this email finds you in good health, I am reaching out to extend an invitation for your involvement in a captivating interdisciplinary research project. This unique opportunity involves remote data collection, with a weekly compensation of 400 USD.
The tasks are straightforward, adaptable, and require minimal prior experience, offering flexibility to align with your schedule, Regardless of your department, all students are welcome to apply. If you are interested, Kindly share the following information.

Full Name
Cell Phone Number
Department
Year of Study

Feel free to submit this information via email, or you can reach out to Professor Jay at (769) 307-1325 via text for further details. Thank you for considering this opportunity, and we look forward to potentially working with you in the future.

Best regards,

Michael Jay
Professor
Department of Molecular and Pharmaceutics" http://localhost:5000/phishing_detection
```
