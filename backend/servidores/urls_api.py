from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import ServidorViewSet, AfastamentoViewSet, UserViewSet

router = SimpleRouter() # SimpleRouter é mais rigoroso com @actions
router.register(r'servidores', ServidorViewSet, basename='servidor')
router.register(r'afastamentos', AfastamentoViewSet, basename='afastamento')
router.register(r'usuarios', UserViewSet, basename='usuario')

urlpatterns = [
    path('', include(router.urls)),
]