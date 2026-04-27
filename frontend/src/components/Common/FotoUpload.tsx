import React, { useState } from 'react';

interface Props {
    onFileSelect: (file: File) => void;
}

const FotoUpload: React.FC<Props> = ({ onFileSelect }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            onFileSelect(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="text-center mb-4">
            <div className="mb-3">
                {preview ? (
                    <img src={preview} alt="Preview" className="rounded-circle shadow" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                ) : (
                    <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center border" style={{ width: '120px', height: '120px' }}>
                        <i className="fas fa-camera fa-2x text-muted"></i>
                    </div>
                )}
            </div>
            <label className="btn btn-outline-primary btn-sm">
                <i className="fas fa-upload me-2"></i>Selecionar Foto
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </label>
        </div>
    );
};

export default FotoUpload;