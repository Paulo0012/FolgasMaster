from django.db import models
from django.contrib.auth.models import User
from datetime import date, timedelta
from math import floor
from dateutil.relativedelta import relativedelta 
from django.utils import timezone 

# Opções para Equipes
EQUIPE_CHOICES = [
    ('E1', 'Equipe 1'),
    ('E2', 'Equipe 2'),
    ('E3', 'Equipe 3'),
    ('E4', 'Equipe 4'),
]

# Opções para Meses (Usado para as preferências de férias)
MESES_CHOICES = [
    ('01', 'Janeiro'), ('02', 'Fevereiro'), ('03', 'Março'), ('04', 'Abril'),
    ('05', 'Maio'), ('06', 'Junho'), ('07', 'Julho'), ('08', 'Agosto'),
    ('09', 'Setembro'), ('10', 'Outubro'), ('11', 'Novembro'), ('12', 'Dezembro'),
]

class Servidor(models.Model):
    """
    Define a entidade Servidor, suas informações essenciais e as bases para cálculo de escala.
    (Tarefa: Revisão e Finalização da Documentação Técnica)
    """
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    
    matricula = models.CharField(max_length=20, unique=True, verbose_name='Matrícula')
    nome_completo = models.CharField(max_length=150, verbose_name='Nome Completo')
    equipe = models.CharField(max_length=2, choices=EQUIPE_CHOICES, verbose_name='Equipe')
    foto = models.ImageField(
        upload_to='servidores_fotos/', 
        null=True, 
        blank=True, 
        verbose_name='Foto do Servidor'
    )
    # NOVO CAMPO: Banco de Horas Extras (em horas)
    horas_extras_acumuladas = models.FloatField(
        default=0.0,
        verbose_name='Banco de Horas Extras Acumuladas'
    )
    # Base para cálculo de escala 1x3
    data_base_plantao = models.DateField(default=date.today, verbose_name='Data Base do Plantão')
    
    # Base para o cálculo anual (renomeado no PRD)
    data_ultima_ferias_anual_base = models.DateField(null=True, blank=True, verbose_name='Data da Última Férias Anual')
    
    # Base para o cálculo de 21 plantões
    data_ferias_21_plantoes = models.DateField(null=True, blank=True, verbose_name='Data Início Última Férias 21')
    
    # NOVOS CAMPOS: Preferência de Férias Anuais
    preferencia_ferias_1 = models.CharField(
        max_length=2, 
        choices=MESES_CHOICES, 
        blank=True, 
        null=True, 
        verbose_name='1ª Preferência (Mês)'
    )
    preferencia_ferias_2 = models.CharField(
        max_length=2, 
        choices=MESES_CHOICES, 
        blank=True, 
        null=True, 
        verbose_name='2ª Preferência (Mês)'
    )

    class Meta:
        verbose_name = "Servidor"
        verbose_name_plural = "Servidores"
        ordering = ['equipe', 'nome_completo']

    def __str__(self):
        return f'{self.nome_completo} ({self.equipe})'
    
    
    def adicionar_horas_extra(self, horas):
        """Adiciona horas ao saldo do servidor."""
        self.horas_extras_acumuladas += horas
        self.save()

    def conceder_folga_compensatoria(self, horas_por_folga=8.0):
        """
        Concede folga compensatória, diminuindo o saldo de horas extras.
        Retorna True se a folga foi concedida, False caso contrário.
        """
        if self.horas_extras_acumuladas >= horas_por_folga:
            self.horas_extras_acumuladas -= horas_por_folga
            self.save()
            return True
        return False
    
    
    def _total_dias_afastamento_para_ciclo(self):
        """
        RN03 - Calcula o total de dias corridos de afastamento (atestado/falta/férias)
        que ocorreram após a data base. Usado para compensar o ciclo de 21 plantões e o ciclo anual.
        """
        base_date = self.data_ferias_21_plantoes or self.data_base_plantao
        
        if not base_date:
            return 0
            
        afastamentos = self.afastamentos.filter(
            data_inicio__gte=base_date
        )
        
        total_dias = 0
        for afastamento in afastamentos:
            end_date = afastamento.data_fim 
            
            if end_date >= afastamento.data_inicio:
                days = (end_date - afastamento.data_inicio).days + 1
                total_dias += days
                
        return total_dias
    
    
    def calcular_21_plantoes(self, data_hoje=date.today()):
        """
        RN02 e RN05 - Calcula plantões e previsão de 21 plantões (84 dias), ajustada por afastamentos.
        (Tarefa: Testes de Fluxo de Compensação e Escala)
        """
        
        data_referencia = self.data_ferias_21_plantoes or self.data_base_plantao

        if not data_referencia:
             return 0, None, 21 
        
        total_dias = (data_hoje - data_referencia).days + 1
        
        # Plantões Trabalhados (1 a cada 4 dias - floor division)
        plantões_trabalhados = max(0, total_dias // 4) 
        
        # 21 plantões * 4 dias/ciclo = 84 dias totais (CORRIGIDO PARA 84 DIAS)
        DIAS_DO_CICLO_COMPLETO = 84 
        
        previsao_sem_ajuste = data_referencia + timedelta(days=DIAS_DO_CICLO_COMPLETO)
        
        # Ajuste por Afastamento (COMPENSAÇÃO - RN03)
        dias_afastamento_total = self._total_dias_afastamento_para_ciclo()
        data_ajustada = previsao_sem_ajuste + timedelta(days=dias_afastamento_total)
        
        # Plantões Restantes
        plantões_restantes = max(0, 21 - plantões_trabalhados)
        
        return plantões_trabalhados, data_ajustada, plantões_restantes
    
    
    def calcular_previsao_ferias_anual(self, data_hoje=date.today()):
        """
        RF07 - Calcula a previsão da Data da Férias Anual (1 ano), ajustada por afastamento.
        """
        data_base = self.data_ferias_21_plantoes if self.data_ferias_21_plantoes else self.data_base_plantao 

        if not data_base:
            return None 

        data_previsao = data_base + relativedelta(years=1)
        
        # Ajuste por Afastamento (A mesma compensação é aplicada ao ciclo anual)
        dias_afastamento_total = self._total_dias_afastamento_para_ciclo()
        data_ajustada = data_previsao + timedelta(days=dias_afastamento_total)
        
        return data_ajustada

    def calcular_status_e_folga(self, data_hoje=date.today()):
        """RN01 - Calcula se o servidor está de plantão ou folga na escala 1x3."""
        dias_passados = (data_hoje - self.data_base_plantao).days
        dia_no_ciclo = dias_passados % 4
        
        status = ''
        proxima_folga_dia = None
        
        if dia_no_ciclo == 0:
            status = 'PLANTÃO'
            proxima_folga_dia = data_hoje + timedelta(days=1) 
        elif dia_no_ciclo == 1:
            status = 'FOLGA (Dia 1)'
            proxima_folga_dia = data_hoje
        elif dia_no_ciclo == 2:
            status = 'FOLGA (Dia 2)'
            proxima_folga_dia = data_hoje
        else: # dia_no_ciclo == 3
            status = 'FOLGA (Dia 3)'
            proxima_folga_dia = data_hoje
            
        return status, proxima_folga_dia
        
    def plantoes_acumulados(self):
        """Retorna o total de plantões acumulados desde a última base."""
        plantoes_trabalhados, _, _ = self.calcular_21_plantoes()
        return plantoes_trabalhados

    def plantoes_restantes_ferias_21(self):
        """Retorna quantos plantões faltam para adquirir o direito."""
        _, _, plantoes_restantes = self.calcular_21_plantoes()
        return plantoes_restantes


class Afastamento(models.Model):
    """
    Define os registros de afastamento, usados para calcular a compensação do ciclo.
    """
    servidor = models.ForeignKey(Servidor, on_delete=models.CASCADE, related_name='afastamentos') 
    
    TIPO_AFASTAMENTO = [
        ('AT', 'Atestado (Afastamento por Saúde)'),
        ('FA', 'Falta (Não Justificada)'),
        ('FE', 'Férias (21 Plantões)'),
        ('FT', 'Férias (Anual)'),
    ]
    
    tipo = models.CharField(max_length=2, choices=TIPO_AFASTAMENTO)
    data_inicio = models.DateField(verbose_name='Data de Início')
    data_fim = models.DateField(verbose_name='Data de Fim')
    motivo = models.TextField(blank=True, null=True, verbose_name='Descrição/Observações')

    class Meta:
        verbose_name = "Afastamento/Registro de Falta"
        verbose_name_plural = "Afastamentos/Registros de Falta"
        ordering = ['-data_inicio'] # CORRIGIDO: usa underscore

    def __str__(self):
        return f'{self.servidor.nome_completo} - {self.get_tipo_display()} ({self.data_inicio} a {self.data_fim})'