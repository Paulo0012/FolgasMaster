import React from 'react';

interface Props {
    label: string;
    name: string;
    type?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    options?: { value: string; label: string }[]; // Para campos de Select
}

const FormInput: React.FC<Props> = ({ label, name, type = "text", value, onChange, options }) => (
    <div className="mb-3">
        <label className="form-label fw-bold">{label}</label>
        {options ? (
            <select className="form-select" name={name} value={value} onChange={onChange}>
                <option value="">Selecione...</option>
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        ) : (
            <input type={type} className="form-control" name={name} value={value} onChange={onChange} />
        )}
    </div>
);

export default FormInput;