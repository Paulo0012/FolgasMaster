from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.db.models import Q

# Importações de Classes e Decoradores
from datetime import date, timedelta
from django.urls import reverse_lazy
from django.contrib.auth.decorators import login_required, permission_required
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.utils.decorators import method_decorator

# Importa os Models e Forms (ATUALIZADO COM OS NOVOS FORMS)
from .models import Servidor, Afastamento, EQUIPE_CHOICES, MESES_CHOICES
from .forms import ServidorForm, AfastamentoForm, HorasExtraAddForm, FolgaCompensatoriaForm

# ----------------------------------------------------------------------
# 1. Views de Navegação e Autenticação
# ----------------------------------------------------------------------

def home_view(request):
    """Redireciona para o login ou dashboard."""
    if request.user.is_authenticated:
        return redirect('dashboard')
    return redirect('login') 


@login_required(login_url='login')
def dashboard_view(request):
    """
    RF06, RF07 - Dashboard gerencial unificado. 
    """
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
            proxima_folga_servidor = None
        else:
            status_servidor, proxima_folga_servidor = servidor_logado.calcular_status_e_folga(data_hoje=hoje)

    except Servidor.DoesNotExist:
        messages.warning(request, "Seu usuário logado não está associado a um Servidor.")

    afastados_hoje = Afastamento.objects.filter(
        data_inicio__lte=hoje, 
        data_fim__gte=hoje
    ).select_related('servidor').order_by('servidor__equipe', 'servidor__nome_completo')
    
    # Lógica para TODOS os Servidores (PAINEL GERENCIAL)
    todos_servidores = Servidor.objects.all().order_by('equipe', 'nome_completo')
    dados_servidores = []

    for servidor in todos_servidores:
        # RF04, RF05 - Calcula previsões compensadas
        plantoes_trabalhados, data_previsao_ferias_21, plantoes_restantes = servidor.calcular_21_plantoes(data_hoje=hoje)
        # RF07 - Previsão Anual
        data_previsao_anual = servidor.calcular_previsao_ferias_anual(data_hoje=hoje)
        
        dados_servidores.append({
            'servidor': servidor,
            'equipe_display': servidor.get_equipe_display(),
            'plantoes_trabalhados': plantoes_trabalhados,
            'plantoes_restantes': plantoes_restantes,
            'data_previsao_ferias_21': data_previsao_ferias_21,
            'data_previsao_anual': data_previsao_anual, 
            # DADO NOVO: Horas Extras
            'horas_extras_acumuladas': servidor.horas_extras_acumuladas,
        })
    
    context = {
        'hoje': hoje,
        'servidor': servidor_logado,
        'status_servidor': status_servidor,
        'proxima_folga_servidor': proxima_folga_servidor,
        'plantoes_restantes': servidor_logado.plantoes_restantes_ferias_21() if servidor_logado and hasattr(servidor_logado, 'plantoes_restantes_ferias_21') else None,
        'afastados_hoje': afastados_hoje,
        'todos_servidores_dados': dados_servidores, 
        'MESES_CHOICES': MESES_CHOICES, 
    }

    return render(request, 'dashboard.html', context)


@login_required(login_url='login')
@permission_required('servidores.view_servidor', raise_exception=True) 
def equipes_list_view(request):
    """RF08, RF09 - Visualiza todas as 4 equipes com status de escala."""
    equipes_data = []
    hoje = date.today()
    
    for equipe_sigla, equipe_nome in EQUIPE_CHOICES:
        servidores = Servidor.objects.filter(equipe=equipe_sigla).order_by('nome_completo')
        
        servidores_status = []
        for servidor in servidores:
            status, proxima_folga = servidor.calcular_status_e_folga(data_hoje=hoje)
            
            em_afastamento = Afastamento.objects.filter(
                servidor=servidor, 
                data_inicio__lte=hoje, 
                data_fim__gte=hoje
            ).first()
            
            if em_afastamento:
                if em_afastamento.tipo == 'FT':
                    status_final = f'FÉRIAS ANUAL (até {em_afastamento.data_fim.strftime("%d/%m")})'
                elif em_afastamento.tipo == 'FE':
                    status_final = f'FÉRIAS 21 PLANTÕES (até {em_afastamento.data_fim.strftime("%d/%m")})'
                else: 
                    status_final = em_afastamento.get_tipo_display().upper()
                proxima_folga = None 
            else:
                status_final = status
                
            servidores_status.append({
                'servidor': servidor,
                'status': status_final,
                'proxima_folga': proxima_folga,
                'afastamento_detalhe': em_afastamento
            })

        equipes_data.append({
            'sigla': equipe_sigla,
            'nome': equipe_nome,
            'servidores': servidores_status
        })

    return render(request, 'equipes_list.html', {'equipes_data': equipes_data})


# ----------------------------------------------------------------------
# 2. Views para Afastamentos (Registro)
# ----------------------------------------------------------------------

@login_required(login_url='login')
@permission_required('servidores.add_afastamento', raise_exception=True) 
def afastamento_create_view(request, servidor_pk):
    """RF03 - Permite registrar atestado, falta ou férias para um servidor específico."""
    servidor = get_object_or_404(Servidor, pk=servidor_pk)
    
    if request.method == 'POST':
        form = AfastamentoForm(request.POST, request.FILES) 
        if form.is_valid():
            afastamento = form.save(commit=False)
            afastamento.servidor = servidor
            afastamento.save()
            messages.success(request, f'Afastamento de {afastamento.get_tipo_display()} registrado com sucesso para {servidor.nome_completo}.')
            return redirect('equipes_list') 
    else:
        form = AfastamentoForm()
        
    context = {
        'form': form, 
        'servidor': servidor,
        'titulo': f'Registrar Afastamento para {servidor.nome_completo}',
    }
    return render(request, 'afastamento_form.html', context)


# ----------------------------------------------------------------------
# 3. Views de CRUD de Servidores (Refatoradas)
# ----------------------------------------------------------------------

class ServidorCreateView(CreateView):
    """RF02 - Cria um novo servidor (apenas Administrador)."""
    model = Servidor
    form_class = ServidorForm 
    template_name = 'servidor_form.html' 
    success_url = reverse_lazy('equipes_list') 
    
    @method_decorator(permission_required('servidores.add_servidor', login_url='login', raise_exception=True))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get_form_kwargs(self):
        """Corrige o upload de arquivos em CBVs (evita o AttributeError)."""
        kwargs = super().get_form_kwargs()
        if self.request.method == 'POST':
            kwargs.update({'files': self.request.FILES}) 
        return kwargs
    
    def form_valid(self, form):
        """Salva a instância, deixando o campo 'usuario' como NULL."""
        response = super().form_valid(form) 
        messages.success(self.request, "Servidor cadastrado com sucesso! Associe-o a um Usuário no Admin para permitir o login.")
        return response


class ServidorUpdateView(UpdateView):
    """RF02 - Edita um servidor existente."""
    model = Servidor
    form_class = ServidorForm
    template_name = 'servidor_form.html'
    success_url = reverse_lazy('equipes_list')
    
    @method_decorator(permission_required('servidores.change_servidor', login_url='login', raise_exception=True))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
        
    def get_form_kwargs(self):
        """Corrige o upload de arquivos em CBVs (evita o AttributeError)."""
        kwargs = super().get_form_kwargs()
        if self.request.method == 'POST':
            kwargs.update({'files': self.request.FILES}) 
        return kwargs
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['titulo'] = f'Editando Servidor: {self.object.nome_completo}'
        return context


class ServidorDeleteView(DeleteView):
    """RF02 - Deleta um registro de servidor."""
    model = Servidor
    template_name = 'servidor_confirm_delete.html'
    success_url = reverse_lazy('equipes_list')
    
    @method_decorator(permission_required('servidores.delete_servidor', login_url='login', raise_exception=True))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def form_valid(self, form):
        messages.success(self.request, f"Servidor {self.object.nome_completo} deletado com sucesso.")
        return super().form_valid(form)


# ----------------------------------------------------------------------
# 4. NOVAS Views de Horas Extras
# ----------------------------------------------------------------------

@login_required(login_url='login')
@permission_required('servidores.change_servidor', raise_exception=True)
def horas_extra_add_view(request, servidor_pk):
    """Permite ao supervisor adicionar horas extras a um servidor."""
    servidor = get_object_or_404(Servidor, pk=servidor_pk)

    if request.method == 'POST':
        form = HorasExtraAddForm(request.POST)
        if form.is_valid():
            horas = form.cleaned_data['horas']
            # O campo 'motivo' é opcional e serve para registro em logs futuros, mas não afeta a lógica de saldo.
            # motivo = form.cleaned_data['motivo'] 
            
            # Chama o método do Model para adicionar as horas
            servidor.adicionar_horas_extra(horas)
            
            messages.success(request, f'{horas} horas extras adicionadas para {servidor.nome_completo}. Saldo atual: {servidor.horas_extras_acumuladas:.2f}h.')
            
            return redirect('equipes_list')
    else:
        form = HorasExtraAddForm()

    context = {
        'form': form,
        'servidor': servidor,
        'titulo': f'Adicionar Horas Extras para {servidor.nome_completo}',
        'saldo_atual': servidor.horas_extras_acumuladas
    }
    return render(request, 'horas_extra_add_form.html', context)


@login_required(login_url='login')
@permission_required('servidores.change_servidor', raise_exception=True)
def folga_horas_extra_view(request, servidor_pk):
    """Permite ao supervisor conceder uma folga compensatória de 8h."""
    servidor = get_object_or_404(Servidor, pk=servidor_pk)
    HORAS_FOLGA = 8.0
    
    if request.method == 'POST':
        form = FolgaCompensatoriaForm(request.POST)
        if form.is_valid() and form.cleaned_data['confirmar']:
            if servidor.conceder_folga_compensatoria(horas_por_folga=HORAS_FOLGA):
                messages.success(request, f'Folga compensatória de {HORAS_FOLGA}h concedida para {servidor.nome_completo}. Saldo atual: {servidor.horas_extras_acumuladas:.2f}h.')
            else:
                messages.error(request, f'❌ {servidor.nome_completo} tem apenas {servidor.horas_extras_acumuladas:.2f}h. Mínimo para folga: {HORAS_FOLGA}h.')
            
            return redirect('equipes_list')
    else:
        form = FolgaCompensatoriaForm()

    context = {
        'form': form,
        'servidor': servidor,
        'titulo': f'Conceder Folga Compensatória ({HORAS_FOLGA}h)',
        'saldo_atual': servidor.horas_extras_acumuladas,
        'horas_para_folga': HORAS_FOLGA
    }
    return render(request, 'folga_horas_extra_form.html', context)