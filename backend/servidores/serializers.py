from rest_framework import serializers
from .models import Servidor, Afastamento

class AfastamentoSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)

    class Meta:
        model = Afastamento
        fields = '__all__'

class ServidorSerializer(serializers.ModelSerializer):
    # Campos calculados que o React vai exibir no Dashboard
    status_escala = serializers.SerializerMethodField()
    proxima_folga = serializers.SerializerMethodField()
    plantoes_dados = serializers.SerializerMethodField()
    equipe_display = serializers.CharField(source='get_equipe_display', read_only=True)

    class Meta:
        model = Servidor
        fields = [
            'id', 'matricula', 'nome_completo', 'equipe', 'equipe_display',
            'foto', 'horas_extras_acumuladas', 'status_escala', 
            'proxima_folga', 'plantoes_dados'
        ]

    def get_status_escala(self, obj):
        status, _ = obj.calcular_status_e_folga()
        return status

    def get_proxima_folga(self, obj):
        _, folga = obj.calcular_status_e_folga()
        return folga.strftime("%d/%m/%Y") if folga else None

    def get_plantoes_dados(self):
        trabalhados, data_21, restantes = self.calcular_21_plantoes()
        return {
            "trabalhados": trabalhados,
            "restantes": restantes,
            "previsao_21_dias": data_21.strftime("%d/%m/%Y") if data_21 else None
        }