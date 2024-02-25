from flask import Flask, request, jsonify
import os
from openai import OpenAI

app = Flask(__name__)

# Fetch the OpenAI API key from environment variable
client = OpenAI(
  api_key=os.environ['OPENAI_API_KEY'],  # this is also the default, it can be omitted
)

@app.route('/phishing_detection', methods=['POST'])
def phishing_detection():
    # Get parameters from the POST request
    email_subject = request.form.get('email_subject')
    emails = request.form.get('emails')
    message = request.form.get('message')

    # Call OpenAI API
    prompt = f"Given this email subject: {email_subject}, emails: {emails}, and message: {message}, provide a list of exact phrases from the email (separated by newlines without any additional commentary) that could signify phishing."
    response = client.completions.create(
        model="gpt-3.5-turbo",
        prompt=prompt,
    )

    # Extract and return OpenAI response in a JSON list
    return jsonify({"phishing_signs": response.choices[0].text.strip().split('\n')})

if __name__ == '__main__':
    app.run(debug=True)
