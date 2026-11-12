# fullstack_developer_capstone

Best Cars: React client, Django authentication and car catalogue, Express/MongoDB dealership and review service, and a Flask/VADER sentiment microservice.

## Local development

1. Install Python requirements from `server/requirements.txt` and run `npm ci && npm run build` in `server/frontend`.
2. Set `DEBUG=true`, `backend_url`, and `sentiment_analyzer_url` for the development services. Configure `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` for the actual hostname.
3. Run `python manage.py makemigrations djangoapp`, `python manage.py migrate`, `python manage.py seed_cars`, and `python manage.py createsuperuser` from `server`.
4. Run the MongoDB/Express and sentiment containers with Docker Compose. Run Django on port 8000. Use `/admin/` for the car catalogue and `/dealers` for the application.

## Containers

Set a random `DJANGO_SECRET_KEY` and run `docker compose up --build -d`. Run migrations, seed_cars and createsuperuser in the web container before using the application. Set trusted origins and allowed hosts to the deployed hostname. Never commit credentials or private keys. Database seeding is non-destructive on restart.

## Verification

`python manage.py test` checks authentication, CSRF protection, anonymous review rejection, and dealership proxy responses. GitHub Actions runs Python checks, builds React and builds application containers. Deployment evidence and screenshots must be captured from the real running services; they are not included as fabricated examples.

Project implementation prepared with AI assistance. No final assessment submission has been performed by the assistant.
