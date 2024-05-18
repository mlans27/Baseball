# scraper/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('pitching_matchups/', views.scrape_pitching_matchups, name='pitching_matchups'),
    path('selected-team/', views.handle_selected_team, name='handle_selected_team'),
]