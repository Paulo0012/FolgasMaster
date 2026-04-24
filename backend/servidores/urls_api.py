from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServidorViewSet, AfastamentoViewSet

router = DefaultRouter()
router.register(r'servidores', ServidorViewSet)
router.register(r'afastamentos', AfastamentoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]