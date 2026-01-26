import '../styles/globals.css'
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function FileUploader({ uploadUrl, onUploadSuccess }) {
    const [previews, setPreviews] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        const newPreviews = acceptedFiles.map(file => ({
            ...file,
            preview: URL.createObjectURL(file)
        }));
        setPreviews(prev => [...prev, ...newPreviews]);
    }, []);

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ onDrop, multiple: true });

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!acceptedFiles.length) return;

        const formData = new FormData();
        acceptedFiles.forEach(file => formData.append("files", file));
        formData.append("upload_preset", "my_upload_preset");
        formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

        try {
            const response = await axios.post(uploadUrl, formData);
            if (onUploadSuccess) onUploadSuccess(response.data);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    return (
        <form onSubmit={handleOnSubmit} className="p-2 m-5 border-2 border-dashed border-orangeFB">
            <div {...getRootProps()} style={{ cursor: "pointer" }}>
                <input {...getInputProps()} />
                {isDragActive ? <h3>Suelta el plano acá...</h3> : <h2>Click para seleccionar el plano a cargar o Suelta los archivos acá</h2>}
            </div>
            <div className="flex flex-row ">
                {previews.map((file, index) => (
                    <img key={index} src={file.preview} alt="Preview" className="w-30 m-5" />
                ))}
            </div>
            <button type="submit" className="btn btn-orange">Upload</button>
        </form>
    );
}
