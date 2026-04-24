from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServidorViewSet, AfastamentoViewSet, UserViewSet

router = DefaultRouter()
router.register(r'servidores', ServidorViewSet)
router.register(r'afastamentos', AfastamentoViewSet)
router.register(r'usuarios', UserViewSet)
urlpatterns = [
    path('', include(router.urls)),
]