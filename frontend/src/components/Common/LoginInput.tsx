import React from 'react';

interface Props {
    label: string;
    icon: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
}

const LoginInput: React.FC<Props> = ({ label, icon, type, placeholder, value, onChange }) => (
    <div className="mb-3">
        <label className="form-label small fw-bold text-secondary">{label}</label>
        <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
                <i className={`fas ${icon} text-muted`}></i>
            </span>
            <input 
                type={type} 
                className="form-control bg-light border-start-0" 
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required 
            />
        </div>
    </div>
);

export default LoginInput;