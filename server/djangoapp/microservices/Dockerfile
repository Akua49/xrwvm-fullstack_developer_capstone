FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && python -m nltk.downloader -d /usr/local/nltk_data vader_lexicon
ENV NLTK_DATA=/usr/local/nltk_data
COPY app.py .
EXPOSE 5050
CMD ["gunicorn", "--bind", "0.0.0.0:5050", "app:app"]
