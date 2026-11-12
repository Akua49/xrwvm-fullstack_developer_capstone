import json
from functools import wraps
import requests
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.middleware.csrf import get_token
from django.views.decorators.http import require_GET, require_POST
from .models import CarMake, CarModel
from .restapis import get_request, post_review, analyze_review_sentiments

def api_errors(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        try:
            return view(*args, **kwargs)
        except (ValueError, KeyError, TypeError):
            return JsonResponse({'error': 'Invalid request data'}, status=400)
        except requests.RequestException:
            return JsonResponse({'error': 'Backend service unavailable'}, status=502)
    return wrapped

@require_GET
def session_info(request):
    return JsonResponse({'csrfToken': get_token(request), 'userName': request.user.username if request.user.is_authenticated else None})

@require_POST
@api_errors
def login_user(request):
    data = json.loads(request.body)
    user = authenticate(request, username=data['userName'], password=data['password'])
    if user is None:
        return JsonResponse({'error': 'Invalid username or password'}, status=401)
    login(request, user)
    return JsonResponse({'status': 'Authenticated', 'userName': user.username, 'csrfToken': get_token(request)})

@require_POST
def logout_request(request):
    logout(request)
    return JsonResponse({'status': 'Logged out'})

@require_POST
@api_errors
def registration(request):
    data = json.loads(request.body)
    username = data['userName'].strip()
    if not username or len(username) > 150:
        return JsonResponse({'error': 'A valid username is required'}, status=400)
    try:
        validate_password(data['password'])
        user = User.objects.create_user(username=username, password=data['password'],
            first_name=data.get('firstName', ''), last_name=data.get('lastName', ''), email=data.get('email', ''))
    except ValidationError as exc:
        return JsonResponse({'error': ' '.join(exc.messages)}, status=400)
    except IntegrityError:
        return JsonResponse({'error': 'Username already exists'}, status=409)
    login(request, user)
    return JsonResponse({'status': 'Authenticated', 'userName': user.username, 'csrfToken': get_token(request)}, status=201)

@require_GET
@api_errors
def get_dealerships(request, state='All'):
    endpoint = 'fetchDealers' if state == 'All' else 'fetchDealers/' + state
    return JsonResponse({'status': 200, 'dealers': get_request(endpoint)})

@require_GET
@api_errors
def get_dealer_details(request, dealer_id):
    dealer = get_request(f'fetchDealer/{dealer_id}')
    return JsonResponse({'status': 200, 'dealer': dealer})

@require_GET
@api_errors
def get_dealer_reviews(request, dealer_id):
    reviews = get_request(f'fetchReviews/dealer/{dealer_id}')
    for review in reviews:
        review['sentiment'] = analyze_review_sentiments(review['review'])['sentiment']
    return JsonResponse({'status': 200, 'reviews': reviews})

@require_GET
def get_cars(request):
    cars = [{'CarMake': car.car_make.name, 'CarModel': car.name, 'year': car.year} for car in CarModel.objects.select_related('car_make')]
    return JsonResponse({'status': 200, 'CarModels': cars, 'CarMakes': list(CarMake.objects.values('id', 'name'))})

@require_POST
@api_errors
def add_review(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Login required'}, status=401)
    data = json.loads(request.body)
    data['name'] = request.user.get_full_name() or request.user.username
    data['dealership'] = int(data['dealership'])
    data['car_year'] = int(data['car_year'])
    if not data.get('review', '').strip() or not 2015 <= data['car_year'] <= 2023:
        return JsonResponse({'error': 'Review and valid car year required'}, status=400)
    return JsonResponse({'status': 200, 'review': post_review(data)})
