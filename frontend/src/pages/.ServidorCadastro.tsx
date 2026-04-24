import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servidorService } from '../services/api';
import FormInput from '../components/Common/FormInput';
import FotoUpload from '../components/Common/FotoUpload';
import SubmitButton from '../components/Common/SubmitButton';

const ServidorCadastro: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [foto, setFoto] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        matricula: '',
        nome_completo: '',
        equipe: 'E1',
        data_base_plantao: new Date().toISOString().split('T')[0],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('matricula', formData.matricula);
        data.append('nome_completo', formData.nome_completo);
        data.append('equipe', formData.equipe);
        data.append('data_base_plantao', formData.data_base_plantao);
        if (foto) data.append('foto', foto);

        try {
            await servidorService.create(data);
            alert("Servidor cadastrado com sucesso!");
            navigate('/equipes');
        } catch (err) {
            console.error(err);
            alert("Erro ao cadastrar servidor. Verifique os dados.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white py-3 border-0">
                            <h4 className="fw-bold mb-0 text-primary">
                                <i className="fas fa-user-plus me-2"></i>Novo Servidor
                            </h4>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <FotoUpload onFileSelect={setFoto} />

                                <div className="row">
                                    <div className="col-md-6">
                                        <FormInput 
                                            label="Matrícula" 
                                            name="matricula" 
                                            value={formData.matricula} 
                                            onChange={handleChange} 
                                        />
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

                                <FormInput 
                                    label="Nome Completo" 
                                    name="nome_completo" 
                                    value={formData.nome_completo} 
                                    onChange={handleChange} 
                                />

                                <FormInput 
                                    label="Data de Início (Para cálculo de escalas)" 
                                    name="data_base_plantao" 
                                    type="date"
                                    value={formData.data_base_plantao} 
                                    onChange={handleChange} 
                                />

                                <div className="d-flex gap-2 mt-4">
                                    <button type="button" className="btn btn-light w-50" onClick={() => navigate(-1)}>
                                        Cancelar
                                    </button>
                                    <SubmitButton 
                                        loading={loading} 
                                        text="Salvar Servidor" 
                                        icon="save" 
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServidorCadastro;