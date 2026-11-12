import os
from flask import Flask, jsonify
from nltk.sentiment import SentimentIntensityAnalyzer
app = Flask(__name__)
sia = SentimentIntensityAnalyzer()
@app.get('/')
def home():
    return jsonify(service='Sentiment Analyzer', endpoint='/analyze/<text>')
@app.get('/analyze/<path:input_txt>')
def analyze_sentiment(input_txt):
    score = sia.polarity_scores(input_txt)['compound']
    return jsonify(sentiment='positive' if score >= .05 else 'negative' if score <= -.05 else 'neutral')
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT','5050')))
