// frontend/src/types/index.ts

export interface PlantoesDados {
    trabalhados: number;
    restantes: number;
    previsao_21_plantoes: string | null;
}

export interface Servidor {
    id: number;
    matricula: string;
    nome_completo: string;
    equipe: string;
    equipe_display: string;
    foto: string | null;
    horas_extras_acumuladas: number;
    status_escala: string;
    proxima_folga: string | null;
    plantoes_dados: PlantoesDados;
    previsao_anual: string | null;
}

export interface Afastamento {
    id: number;
    tipo: string;
    tipo_display: string;
    data_inicio: string;
    data_fim: string;
    motivo: string;
    servidor: number;
}