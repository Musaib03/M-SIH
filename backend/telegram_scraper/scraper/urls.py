# scraper/urls.py
from django.urls import path
from .views import scrape_view

urlpatterns = [
    path('scrape/', scrape_view, name='scrape'),
]
