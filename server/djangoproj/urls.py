from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
urlpatterns = [
    path('admin/', admin.site.urls),
    path('djangoapp/', include('djangoapp.urls')),
    path('about', TemplateView.as_view(template_name='About.html')),
    path('contact', TemplateView.as_view(template_name='Contact.html')),
    re_path(r'^(?:|about|contact|login|register|dealers|dealer/\d+|postreview/\d+)/?$', TemplateView.as_view(template_name='index.html')),
] + staticfiles_urlpatterns()
