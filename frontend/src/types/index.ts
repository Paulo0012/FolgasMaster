// Interface principal do Servidor (Model Servidor)
export interface Servidor {
  id: number;
  nome: string;
  matricula: string;
  equipe: 'A' | 'B' | 'C' | 'D'; // Tipagem estrita para as 4 equipes
  data_inicio: string;
  foto?: string; // Caminho da imagem (opcional)
  saldo_horas: number;
  total_plantoes: number; // Para o cálculo dos 84 dias
  status: 'Ativo' | 'Afastado' | 'Férias';
}

// Interface para Registos de Afastamento
export interface Afastamento {
  id: number;
  servidor: number; // ID do servidor
  tipo: 'Atestado' | 'Falta' | 'Licença';
  data_inicio: string;
  data_fim: string;
  observacao?: string;
}

// Interface para Horas Extras
export interface HoraExtra {
  id: number;
  servidor: number;
  data: string;
  quantidade_horas: number;
  descricao: string;
}

// Interface para o Dashboard (Resumo)
export interface DashboardStats {
  total_servidores: number;
  equipes_ativas: number;
  folgas_hoje: number;
  servidores_afastados: number;
}
