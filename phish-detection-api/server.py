from flask import Flask, request, jsonify
import os
from openai import OpenAI

app = Flask(__name__)

# Fetch the OpenAI API key from environment variable
client = OpenAI(
  api_key=os.environ['API_KEY_OPENAI'],  # this is also the default, it can be omitted
)

@app.route('/phishing_detection', methods=['POST'])
def phishing_detection():
    # Get parameters from the POST request
    email_subject = request.form.get('email_subject')
    emails = request.form.get('emails')
    message = request.form.get('message')

    # Call OpenAI API
    prompt = f"Given this email subject: {email_subject}, emails: {emails}, and message: {message}, provide a list of exact phrases from the email (separated ONLY by newlines with no other added symbols) that could signify phishing. On a new line, then explain why this email could be a phishing email without any newlines in the explanation."
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}
        ],
    )

    # Extract and return OpenAI response in a JSON list
    print(response.choices[0].message.content.split('\n'))
    return jsonify({"phishingSigns": response.choices[0].message.content.split('\n')})

if __name__ == '__main__':
    app.run(debug=True)
