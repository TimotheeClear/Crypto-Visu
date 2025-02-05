# myapi/urls.py
from django.urls import include, path
from rest_framework import routers
from . import views
from .views import FetchCoinNews, FetchCoinPrice

router = routers.DefaultRouter()
router.register(r'heroes', views.HeroViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('FetchCoinNews/', FetchCoinNews.as_view()),
    path('FetchCoinPrice/', FetchCoinPrice.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]