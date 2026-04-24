from django import forms
from .models import Servidor, Afastamento

# ----------------------------------------------------
# 1. Formulário para o Modelo Servidor (CRUD)
# ----------------------------------------------------

class ServidorForm(forms.ModelForm):
    class Meta:
        model = Servidor
        fields = [
            'matricula', 
            'nome_completo', 
            'equipe', 
            'foto', 
            'data_base_plantao', 
            'data_ultima_ferias_anual_base', # CAMPO RENOMEADO
            'data_ferias_21_plantoes',       # NOVO CAMPO
            'preferencia_ferias_1',          # NOVO CAMPO
            'preferencia_ferias_2'           # NOVO CAMPO
        ]
        widgets = {
            'data_base_plantao': forms.DateInput(attrs={'type': 'date'}),
            'data_ultima_ferias_anual_base': forms.DateInput(attrs={'type': 'date'}), 
            'data_ferias_21_plantoes': forms.DateInput(attrs={'type': 'date'}), 
        }
        labels = {
            'matricula': 'Matrícula',
            'nome_completo': 'Nome Completo',
            'equipe': 'Equipe',
            'foto': 'Foto do Servidor',
            'data_base_plantao': 'Data Base do Plantão (Primeiro dia de trabalho)',
            'data_ultima_ferias_anual_base': 'Data da Última Férias (Anual)', 
            'data_ferias_21_plantoes': 'Data Início Última Férias 21 Plantões', 
            'preferencia_ferias_1': '1ª Preferência de Férias (Mês)', # NOVO LABEL
            'preferencia_ferias_2': '2ª Preferência de Férias (Mês)', # NOVO LABEL
        }

# ----------------------------------------------------
# 2. Formulário para o Modelo Afastamento 
# ----------------------------------------------------

class AfastamentoForm(forms.ModelForm):
    class Meta:
        model = Afastamento
        fields = [
            'tipo', 
            'data_inicio', 
            'data_fim', 
            'motivo'
        ]
        widgets = {
            'data_inicio': forms.DateInput(attrs={'type': 'date'}),
            'data_fim': forms.DateInput(attrs={'type': 'date'}),
            'motivo': forms.Textarea(attrs={'rows': 3}),
        }
        labels = {
            'tipo': 'Tipo de Afastamento',
            'data_inicio': 'Data de Início',
            'data_fim': 'Data de Fim',
            'motivo': 'Descrição / Observações',
        }
        
class HorasExtraAddForm(forms.Form):
    """
    Formulário simples para o supervisor adicionar horas extras.
    """
    horas = forms.FloatField(
        min_value=0.5,
        widget=forms.NumberInput(attrs={'step': '0.5'}),
        label='Quantidade de Horas Extras a Adicionar'
    )
    motivo = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 2}),
        label='Motivo/Referência (Ex: Plantão 15/10)'
    )


# ----------------------------------------------------
# 4. NOVO Formulário para Conceder Folga Compensatória
# ----------------------------------------------------

class FolgaCompensatoriaForm(forms.Form):
    """
    Formulário simples para confirmar a concessão da folga.
    """
    confirmar = forms.BooleanField(
        required=True,
        label='Confirmar concessão de 8 horas de Folga Compensatória?',
        widget=forms.CheckboxInput()
    )