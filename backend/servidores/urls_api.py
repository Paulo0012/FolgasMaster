from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServidorViewSet, AfastamentoViewSet, UserViewSet

router = DefaultRouter()
# O registro deve ser simples assim:
router.register(r'servidores', ServidorViewSet, basename='servidor')
router.register(r'afastamentos', AfastamentoViewSet, basename='afastamento')
router.register(r'usuarios', UserViewSet, basename='usuario')

urlpatterns = [
    path('', include(router.urls)),
]