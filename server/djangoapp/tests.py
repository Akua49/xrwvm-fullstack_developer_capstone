import json
from unittest.mock import patch
from django.test import TestCase, Client
from django.contrib.auth.models import User

class ApiTests(TestCase):
    def test_authentication_and_logout(self):
        User.objects.create_user(username='testuser', password='SecureTest-293!')
        res=self.client.post('/djangoapp/login',data=json.dumps({'userName':'testuser','password':'wrong'}),content_type='application/json')
        self.assertEqual(res.status_code,401)
        res=self.client.post('/djangoapp/login',data=json.dumps({'userName':'testuser','password':'SecureTest-293!'}),content_type='application/json')
        self.assertEqual(res.json()['status'],'Authenticated')
        self.assertEqual(self.client.get('/djangoapp/session').json()['userName'],'testuser')
        self.client.post('/djangoapp/logout')
        self.assertIsNone(self.client.get('/djangoapp/session').json()['userName'])
    def test_anonymous_cannot_post_review(self):
        self.assertEqual(self.client.post('/djangoapp/add_review',data='{}',content_type='application/json').status_code,401)
    def test_csrf_required(self):
        client=Client(enforce_csrf_checks=True)
        self.assertEqual(client.post('/djangoapp/login',data='{}',content_type='application/json').status_code,403)
    @patch('djangoapp.views.get_request',return_value=[{'id':1,'state':'Kansas'}])
    def test_dealer_filter(self, fetch):
        res=self.client.get('/djangoapp/get_dealers/Kansas')
        self.assertEqual(res.json()['dealers'][0]['state'],'Kansas')
        fetch.assert_called_once_with('fetchDealers/Kansas')
    def test_registration_rejects_duplicate_username(self):
        data={'userName':'newuser','password':'SecureTest-293!'}
        self.assertEqual(self.client.post('/djangoapp/register',data=json.dumps(data),content_type='application/json').status_code,201)
        self.assertEqual(self.client.post('/djangoapp/register',data=json.dumps(data),content_type='application/json').status_code,409)
