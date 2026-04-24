from django.contrib import admin
from .models import Servidor, Afastamento

# ----------------------------------------------------
# 1. Configuração do Servidor no Admin (ATUALIZADA)
# ----------------------------------------------------
@admin.register(Servidor)
class ServidorAdmin(admin.ModelAdmin):
    # Campos exibidos na lista de servidores
    list_display = (
        'matricula', 
        'nome_completo', 
        'equipe', 
        'data_base_plantao', 
        'data_ultima_ferias_anual_base', 
        'data_ferias_21_plantoes',       
        'plantoes_restantes_ferias_21_display'
    )
    
    # Filtros laterais para facilitar a busca
    list_filter = (
        'equipe', 
        'data_base_plantao', 
        'data_ultima_ferias_anual_base', 
        'data_ferias_21_plantoes',
        'preferencia_ferias_1', # NOVO FILTRO
        'preferencia_ferias_2', # NOVO FILTRO
    )
    
    # Campos que podem ser pesquisados
    search_fields = ('nome_completo', 'matricula')
    
    # Campos que aparecem nos detalhes do Servidor
    fieldsets = (
        ('Dados Essenciais', {
            'fields': ('usuario', 'matricula', 'nome_completo', 'equipe', 'foto')
        }),
        ('Controle de Escala e Ciclos', {
            'fields': ('data_base_plantao', 'data_ferias_21_plantoes', 'data_ultima_ferias_anual_base'),
            'description': 'Datas base para cálculos de plantão e ciclos anuais.'
        }),
        ('Preferências de Férias Anuais', { # NOVO FIELDSET
            'fields': ('preferencia_ferias_1', 'preferencia_ferias_2'),
            'description': 'Mapeamento dos meses preferenciais para a gestão de restrição de 10%.'
        }),
    )

    # Adiciona a informação de plantões restantes na lista
    def plantoes_restantes_ferias_21_display(self, obj):
        restantes = obj.plantoes_restantes_ferias_21() 
        if restantes <= 0:
            return "DIREITO ADQUIRIDO!"
        return restantes
    
    plantoes_restantes_ferias_21_display.short_description = 'Plantões Restantes (21)'


# ----------------------------------------------------
# 2. Configuração de Afastamento no Admin (Inalterada)
# ----------------------------------------------------
@admin.register(Afastamento)
class AfastamentoAdmin(admin.ModelAdmin):
    list_display = (
        'servidor', 
        'tipo', 
        'data_inicio', 
        'data_fim', 
        'motivo_preview'
    )
    list_filter = ('tipo', 'data_inicio', 'servidor__equipe')
    search_fields = ('servidor__nome_completo', 'motivo')
    date_hierarchy = 'data_inicio'
    
    def motivo_preview(self, obj):
        return obj.motivo[:50] + '...' if obj.motivo and len(obj.motivo) > 50 else obj.motivo
    motivo_preview.short_description = 'Motivo (Preview)'