from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.db.models import Q
from datetime import date, timedelta

# Django Autenticação e Permissões
from django.urls import reverse_lazy
from django.contrib.auth.decorators import login_required, permission_required
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.utils.decorators import method_decorator

# Rest Framework (Para o React)
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

# Importa os Models, Forms e Serializers
from .models import Servidor, Afastamento, EQUIPE_CHOICES, MESES_CHOICES
from .forms import ServidorForm, AfastamentoForm, HorasExtraAddForm, FolgaCompensatoriaForm
from .serializers import ServidorSerializer, AfastamentoSerializer

# ----------------------------------------------------------------------
# 1. API VIEWSETS (USADOS PELO REACT)
# ----------------------------------------------------------------------

class ServidorViewSet(viewsets.ModelViewSet):
    """
    API para o React. Inclui busca de todos os servidores 
    e uma rota especial para o perfil do usuário logado.
    """
    queryset = Servidor.objects.all().order_by('equipe', 'nome_completo')
    serializer_class = ServidorSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Retorna os dados do servidor vinculado ao usuário logado."""
        try:
            servidor = Servidor.objects.get(usuario=request.user)
            serializer = self.get_serializer(servidor)
            return Response(serializer.data)
        except Servidor.DoesNotExist:
            return Response(
                {"detail": "Nenhum servidor vinculado a este usuário."}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def adicionar_horas(self, request, pk=None):
        """Endpoint para adicionar horas extras via API."""
        servidor = self.get_object()
        horas = request.data.get('horas')
        if horas:
            servidor.adicionar_horas_extra(float(horas))
            return Response({'status': 'horas adicionadas', 'saldo': servidor.horas_extras_acumuladas})
        return Response({'error': 'Informe as horas'}, status=status.HTTP_400_BAD_REQUEST)


class AfastamentoViewSet(viewsets.ModelViewSet):
    """API para listagem e registro de afastamentos."""
    queryset = Afastamento.objects.all().order_by('-data_inicio')
    serializer_class = AfastamentoSerializer
    permission_classes = [permissions.IsAuthenticated]


# ----------------------------------------------------------------------
# 2. VIEWS DE NAVEGAÇÃO (TEMPLATE DJANGO)
# ----------------------------------------------------------------------

def home_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    return redirect('login') 

@login_required(login_url='login')
def dashboard_view(request):
    hoje = date.today()
    servidor_logado = None
    proxima_folga_servidor = None
    status_servidor = None

    try:
        servidor_logado = Servidor.objects.get(usuario=request.user)
        em_afastamento_hoje = Afastamento.objects.filter(
            servidor=servidor_logado,
            data_inicio__lte=hoje,
            data_fim__gte=hoje
        ).exists()

        if em_afastamento_hoje:
            status_servidor = "AFASTADO (Atestado/Férias/Falta)"
        else:
            status_servidor, proxima_folga_servidor = servidor_logado.calcular_status_e_folga(data_hoje=hoje)
    except Servidor.DoesNotExist:
        pass

    afastados_hoje = Afastamento.objects.filter(data_inicio__lte=hoje, data_fim__gte=hoje).select_related('servidor')
    
    todos_servidores = Servidor.objects.all().order_by('equipe', 'nome_completo')
    dados_servidores = []

    for servidor in todos_servidores:
        plantoes_trabalhados, data_previsao_ferias_21, plantoes_restantes = servidor.calcular_21_plantoes(data_hoje=hoje)
        data_previsao_anual = servidor.calcular_previsao_ferias_anual(data_hoje=hoje)
        
        dados_servidores.append({
            'servidor': servidor,
            'equipe_display': servidor.get_equipe_display(),
            'plantoes_trabalhados': plantoes_trabalhados,
            'plantoes_restantes': plantoes_restantes,
            'data_previsao_ferias_21': data_previsao_ferias_21,
            'data_previsao_anual': data_previsao_anual, 
            'horas_extras_acumuladas': servidor.horas_extras_acumuladas,
        })
    
    context = {
        'hoje': hoje,
        'servidor': servidor_logado,
        'status_servidor': status_servidor,
        'proxima_folga_servidor': proxima_folga_servidor,
        'afastados_hoje': afastados_hoje,
        'todos_servidores_dados': dados_servidores, 
    }
    return render(request, 'dashboard.html', context)


@login_required(login_url='login')
@permission_required('servidores.view_servidor', raise_exception=True) 
def equipes_list_view(request):
    equipes_data = []
    hoje = date.today()
    
    for equipe_sigla, equipe_nome in EQUIPE_CHOICES:
        servidores = Servidor.objects.filter(equipe=equipe_sigla).order_by('nome_completo')
        servidores_status = []
        for servidor in servidores:
            status, proxima_folga = servidor.calcular_status_e_folga(data_hoje=hoje)
            em_afastamento = Afastamento.objects.filter(servidor=servidor, data_inicio__lte=hoje, data_fim__gte=hoje).first()
            
            if em_afastamento:
                status_final = em_afastamento.get_tipo_display().upper()
                proxima_folga = None 
            else:
                status_final = status
                
            servidores_status.append({
                'servidor': servidor, 'status': status_final, 'proxima_folga': proxima_folga
            })

        equipes_data.append({'sigla': equipe_sigla, 'nome': equipe_nome, 'servidores': servidores_status})
    return render(request, 'equipes_list.html', {'equipes_data': equipes_data})

# ----------------------------------------------------------------------
# 3. CRUD E OPERAÇÕES (HORAS EXTRAS / FOLGAS)
# ----------------------------------------------------------------------

@login_required(login_url='login')
@permission_required('servidores.add_afastamento', raise_exception=True) 
def afastamento_create_view(request, servidor_pk):
    servidor = get_object_or_404(Servidor, pk=servidor_pk)
    if request.method == 'POST':
        form = AfastamentoForm(request.POST, request.FILES) 
        if form.is_valid():
            afastamento = form.save(commit=False)
            afastamento.servidor = servidor
            afastamento.save()
            return redirect('equipes_list') 
    else:
        form = AfastamentoForm()
    return render(request, 'afastamento_form.html', {'form': form, 'servidor': servidor})

class ServidorCreateView(CreateView):
    model = Servidor
    form_class = ServidorForm 
    template_name = 'servidor_form.html' 
    success_url = reverse_lazy('equipes_list') 
    
    @method_decorator(permission_required('servidores.add_servidor', login_url='login', raise_exception=True))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

class ServidorUpdateView(UpdateView):
    model = Servidor
    form_class = ServidorForm
    template_name = 'servidor_form.html'
    success_url = reverse_lazy('equipes_list')

class ServidorDeleteView(DeleteView):
    model = Servidor
    template_name = 'servidor_confirm_delete.html'
    success_url = reverse_lazy('equipes_list')

@login_required(login_url='login')
@permission_required('servidores.change_servidor', raise_exception=True)
def horas_extra_add_view(request, servidor_pk):
    servidor = get_object_or_404(Servidor, pk=servidor_pk)
    if request.method == 'POST':
        form = HorasExtraAddForm(request.POST)
        if form.is_valid():
            horas = form.cleaned_data['horas']
            servidor.adicionar_horas_extra(horas)
            messages.success(request, f'Horas adicionadas para {servidor.nome_completo}.')
            return redirect('equipes_list')
    else:
        form = HorasExtraAddForm()
    return render(request, 'horas_extra_add_form.html', {'form': form, 'servidor': servidor})

@login_required(login_url='login')
@permission_required('servidores.change_servidor', raise_exception=True)
def folga_horas_extra_view(request, servidor_pk):
    servidor = get_object_or_404(Servidor, pk=servidor_pk)
    if request.method == 'POST':
        form = FolgaCompensatoriaForm(request.POST)
        if form.is_valid() and form.cleaned_data['confirmar']:
            if servidor.conceder_folga_compensatoria(horas_por_folga=8.0):
                messages.success(request, 'Folga concedida com sucesso.')
            else:
                messages.error(request, 'Saldo insuficiente.')
            return redirect('equipes_list')
    else:
        form = FolgaCompensatoriaForm()
    return render(request, 'folga_horas_extra_form.html', {'form': form, 'servidor': servidor})