from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServidorViewSet, AfastamentoViewSet, HoraExtraViewSet

router = DefaultRouter()
router.register(r'servidores', ServidorViewSet)
router.register(r'afastamentos', AfastamentoViewSet)
router.register(r'horas-extras', HoraExtraViewSet)

urlpatterns = [
    path('', include(router.urls)),
]