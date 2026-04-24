import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FormInput from '../components/Common/FormInput';

const ServidorCadastro: React.FC = () => {
    const navigate = useNavigate();
    const [foto, setFoto] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        matricula: '',
        nome_completo: '',
        equipe: '',
        data_base_plantao: new Date().toISOString().split('T')[0],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Preparando os dados para envio (Multi-part para suportar imagem)
        const data = new FormData();
        data.append('matricula', formData.matricula);
        data.append('nome_completo', formData.nome_completo);
        data.append('equipe', formData.equipe);
        data.append('data_base_plantao', formData.data_base_plantao);
        if (foto) data.append('foto', foto);

        try {
            await api.post('servidores/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Servidor cadastrado com sucesso!');
            navigate('/equipes');
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            alert('Erro ao salvar servidor.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow col-md-8 mx-auto">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Novo Servidor</h4>
                </div>
                <form onSubmit={handleSubmit} className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <FormInput label="Matrícula" name="matricula" value={formData.matricula} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <FormInput 
                                label="Equipe" 
                                name="equipe" 
                                value={formData.equipe} 
                                onChange={handleChange} 
                                options={[
                                    { value: 'E1', label: 'Equipe 1' },
                                    { value: 'E2', label: 'Equipe 2' },
                                    { value: 'E3', label: 'Equipe 3' },
                                    { value: 'E4', label: 'Equipe 4' },
                                ]} 
                            />
                        </div>
                    </div>

                    <FormInput label="Nome Completo" name="nome_completo" value={formData.nome_completo} onChange={handleChange} />
                    
                    <FormInput label="Data Base do Plantão" name="data_base_plantao" type="date" value={formData.data_base_plantao} onChange={handleChange} />

                    <div className="mb-4">
                        <label className="form-label fw-bold">Foto do Servidor</label>
                        <input type="file" className="form-control" onChange={(e) => setFoto(e.target.files ? e.target.files[0] : null)} />
                    </div>

                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancelar</button>
                        <button type="submit" className="btn btn-success px-4">Salvar Servidor</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServidorCadastro;