from django.contrib import admin
from django.urls import path, include
from django.conf import settings 
from django.conf.urls.static import static 

# 1. Importa as FUNÇÕES de View
from servidores.views import (
    home_view, 
    dashboard_view, 
    equipes_list_view, 
    afastamento_create_view,
    # NOVAS VIEWS:
    horas_extra_add_view, 
    folga_horas_extra_view
)

# 2. Importa as CLASSES de View (CBVs)
from servidores.views import (
    ServidorCreateView, 
    ServidorUpdateView, 
    ServidorDeleteView
) 


urlpatterns = [
    # Acesso ao painel administrativo do Django
    path('admin/', admin.site.urls),

    # Rotas de Autenticação (Login, Logout, etc.)
    path('accounts/', include('django.contrib.auth.urls')),
# ------------------------------------------------------------------
    # 1. Rotas de Navegação (FUNÇÕES)
    # ------------------------------------------------------------------
    path('', home_view, name='home'), 
    path('dashboard/', dashboard_view, name='dashboard'),
    path('equipes/', equipes_list_view, name='equipes_list'),

    # ------------------------------------------------------------------
    # 2. Rotas de CRUD de Servidores (CLASSES)
    # ------------------------------------------------------------------
    path('servidor/novo/', ServidorCreateView.as_view(), name='servidor_create'),
    path('servidor/<int:pk>/editar/', ServidorUpdateView.as_view(), name='servidor_update'),
    path('servidor/<int:pk>/deletar/', ServidorDeleteView.as_view(), name='servidor_delete'),

    # ------------------------------------------------------------------
    # 3. Rotas de Afastamento e Horas Extras (FUNÇÕES)
    # ------------------------------------------------------------------
    path('afastamento/novo/<int:servidor_pk>/', afastamento_create_view, name='afastamento_create'),
    # NOVAS ROTAS DE HORAS EXTRAS
    path('servidor/<int:servidor_pk>/add_horas_extra/', horas_extra_add_view, name='horas_extra_add'),
    path('servidor/<int:servidor_pk>/folga_compensatoria/', folga_horas_extra_view, name='folga_horas_extra'),
]

# APENAS para desenvolvimento (DEBUG=True): serve os arquivos de MÍDIA
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)