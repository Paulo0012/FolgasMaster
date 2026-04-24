import React from 'react';

interface Props {
    loading: boolean;
    text: string;
    loadingText?: string;
    icon?: string;
}

const SubmitButton: React.FC<Props> = ({ 
    loading, 
    text, 
    loadingText = "Processando...", 
    icon = "check" 
}) => (
    <button 
        type="submit" 
        className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
        disabled={loading}
    >
        {loading ? (
            <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {loadingText}
            </>
        ) : (
            <>
                <i className={`fas fa-${icon} me-2`}></i>
                {text}
            </>
        )}
    </button>
);

export default SubmitButton;