import React, { useState } from 'react';
import api from '../../services/api';
import LoginInput from '../Common/LoginInput';
import SubmitButton from '../Common/SubmitButton';

const UsuarioForm: React.FC<{ onModuloFechar: () => void }> = ({ onModuloFechar }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        is_staff: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('usuarios/', formData);
            alert("Usuário criado com sucesso!");
            onModuloFechar();
        } catch (err) {
            alert("Erro ao criar usuário. Talvez o nome já exista.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-3">
            <LoginInput label="Login (Username)" icon="fa-user" type="text" placeholder="ex: paulo.silva" value={formData.username} onChange={(val) => setFormData({...formData, username: val})} />
            <LoginInput label="E-mail" icon="fa-envelope" type="email" placeholder="email@exemplo.com" value={formData.email} onChange={(val) => setFormData({...formData, email: val})} />
            <LoginInput label="Senha Inicial" icon="fa-lock" type="password" placeholder="••••••••" value={formData.password} onChange={(val) => setFormData({...formData, password: val})} />
            
            <div className="form-check form-switch mb-4">
                <input className="form-check-input" type="checkbox" checked={formData.is_staff} onChange={(e) => setFormData({...formData, is_staff: e.target.checked})} />
                <label className="form-check-label small fw-bold">Acesso de Administrador?</label>
            </div>

            <SubmitButton loading={loading} text="Salvar Usuário" icon="user-check" />
        </form>
    );
};

export default UsuarioForm;