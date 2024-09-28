# scraper/urls.py
from django.urls import path
from .views import scrape_view
from . import views

urlpatterns = [
    path('scrape/', scrape_view, name='scrape'),
    path('find_matching_transactions/', views.find_matching_transactions, name='find_matching_transactions'),
]
