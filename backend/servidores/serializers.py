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
    # Campos calculados pelo SerializerMethodField (Apenas leitura)
    status_escala = serializers.SerializerMethodField(read_only=True)
    proxima_folga = serializers.SerializerMethodField(read_only=True)
    plantoes_dados = serializers.SerializerMethodField(read_only=True)
    previsao_anual = serializers.SerializerMethodField(read_only=True)
    
    # Campo vindo do choice do Model
    equipe_display = serializers.CharField(source='get_equipe_display', read_only=True)

    class Meta:
        model = Servidor
        fields = [
            'id', 'matricula', 'nome_completo', 'equipe', 'equipe_display',
            'foto', 'horas_extras_acumuladas', 'data_base_plantao', 
            'status_escala', 'proxima_folga', 'plantoes_dados', 'previsao_anual'
        ]
        # data_base_plantao é necessário para o POST, mas os outros são automáticos
        extra_kwargs = {
            'foto': {'required': False},
            'horas_extras_acumuladas': {'required': False},
        }

    def get_status_escala(self, obj):
        try:
            status, _ = obj.calcular_status_e_folga()
            return status
        except:
            return "Erro no cálculo"

    def get_proxima_folga(self, obj):
        try:
            _, folga = obj.calcular_status_e_folga()
            return folga.strftime("%d/%m/%Y") if folga else None
        except:
            return None

    def get_plantoes_dados(self, obj):
        try:
            trabalhados, data_21, restantes = obj.calcular_21_plantoes()
            return {
                "trabalhados": trabalhados,
                "restantes": restantes,
                "previsao_21_plantoes": data_21.strftime("%d/%m/%Y") if data_21 else None
            }
        except:
            return {"trabalhados": 0, "restantes": 0, "previsao_21_plantoes": None}

    def get_previsao_anual(self, obj):
        try:
            data_anual = obj.calcular_previsao_ferias_anual()
            return data_anual.strftime("%d/%m/%Y") if data_anual else None
        except:
            return None