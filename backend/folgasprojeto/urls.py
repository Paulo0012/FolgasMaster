"""
Configuração de URL para o projeto FolgasMaster.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings 
from django.conf.urls.static import static 

# Importamos as views para manter compatibilidade com os templates antigos (opcional)
from servidores.views import (
    home_view, 
    dashboard_view, 
    equipes_list_view, 
    afastamento_create_view,
    horas_extra_add_view, 
    folga_horas_extra_view,
    ServidorCreateView, 
    ServidorUpdateView, 
    ServidorDeleteView
)

urlpatterns = [
    # 1. Painel Administrativo
    path('admin/', admin.site.urls),

    # 2. Autenticação Nativa (Login/Logout)
    path('accounts/', include('django.contrib.auth.urls')),

    # ------------------------------------------------------------------
    # 3. ROTA DA API (ESTA É A QUE O REACT VAI USAR)
    # ------------------------------------------------------------------
    # Inclui as rotas definidas em servidores/urls_api.py
    path('api/', include('servidores.urls_api')),

    # ------------------------------------------------------------------
    # 4. ROTAS DE NAVEGAÇÃO (TEMPLATES DJANGO)
    # ------------------------------------------------------------------
    # Mantivemos aqui para que você possa testar o backend de forma legada
    path('', home_view, name='home'), 
    path('dashboard/', dashboard_view, name='dashboard'),
    path('equipes/', equipes_list_view, name='equipes_list'),

    # CRUD Servidores
    path('servidor/novo/', ServidorCreateView.as_view(), name='servidor_create'),
    path('servidor/<int:pk>/editar/', ServidorUpdateView.as_view(), name='servidor_update'),
    path('servidor/<int:pk>/deletar/', ServidorDeleteView.as_view(), name='servidor_delete'),

    # Afastamentos e Horas Extras
    path('afastamento/novo/<int:servidor_pk>/', afastamento_create_view, name='afastamento_create'),
    path('servidor/<int:servidor_pk>/add_horas_extra/', horas_extra_add_view, name='horas_extra_add'),
    path('servidor/<int:servidor_pk>/folga_compensatoria/', folga_horas_extra_view, name='folga_horas_extra'),
]

# Configuração para servir arquivos de MÍDIA (Fotos dos Servidores) em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)