from rest_framework import serializers
from .models import Servidor, Afastamento

class AfastamentoSerializer(serializers.ModelSerializer):
    """Serializa os afastamentos, incluindo a descrição legível do tipo."""
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)

    class Meta:
        model = Afastamento
        fields = '__all__'

class ServidorSerializer(serializers.ModelSerializer):
    """
    Serializa o Servidor enviando campos calculados (Business Logic) 
    direto para o Frontend evitar cálculos complexos no React.
    """
    status_escala = serializers.SerializerMethodField()
    proxima_folga = serializers.SerializerMethodField()
    plantoes_dados = serializers.SerializerMethodField()
    previsao_anual = serializers.SerializerMethodField()
    equipe_display = serializers.CharField(source='get_equipe_display', read_only=True)

    class Meta:
        model = Servidor
        fields = [
            'id', 'matricula', 'nome_completo', 'equipe', 'equipe_display',
            'foto', 'horas_extras_acumuladas', 'status_escala', 
            'proxima_folga', 'plantoes_dados', 'previsao_anual'
        ]

    def get_status_escala(self, obj):
        # Verifica se está afastado hoje antes de calcular escala
        status, _ = obj.calcular_status_e_folga()
        return status

    def get_proxima_folga(self, obj):
        _, folga = obj.calcular_status_e_folga()
        return folga.strftime("%d/%m/%Y") if folga else None

    def get_plantoes_dados(self, obj):
        # Correção: Adicionado 'obj' e chamada correta do método do model
        trabalhados, data_21, restantes = obj.calcular_21_plantoes()
        return {
            "trabalhados": trabalhados,
            "restantes": restantes,
            "previsao_21_plantoes": data_21.strftime("%d/%m/%Y") if data_21 else None
        }

    def get_previsao_anual(self, obj):
        data_anual = obj.calcular_previsao_ferias_anual()
        return data_anual.strftime("%d/%m/%Y") if data_anual else None