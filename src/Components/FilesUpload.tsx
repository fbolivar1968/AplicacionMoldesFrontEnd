import { useState } from "react";
import useAxios from "../Hooks/useAxios/IndexAx.js";
import { useFormData } from "../Hooks/FormNewHerrContext/HerrContext.js";
import { useDropzone } from "react-dropzone";
import type { Accept } from "react-dropzone";
import {
    FileAudio,
    FileIcon,
    FileImage,
    FileText,
    FileVideo,
    Plus,
    Trash2,
    Upload,
    X,
} from 'lucide-react';

export type TargetDocumentField = 'hesp_IdImagen' | 'hesp_IdPlano' | 'hesp_IdManual';

type FileWithProgress = {
    id: string;
    file: File;
    progress: number;
    uploaded: boolean;
};

export type FilesUploadProps = {
    targetField?: TargetDocumentField;
    endpoint?: string;
    label?: string;
    sublabel?: string;
    accept?: Accept;
    maxFiles?: number;
    extraFormData?: Record<string, any>;
    onUploadSuccess?: (id: number, targetField?: TargetDocumentField) => void;
};

const getEndpointForField = (field: TargetDocumentField): string => {
    switch (field) {
        case 'hesp_IdPlano':
            return '/api/documents/planos/';
        case 'hesp_IdManual':
            return '/api/documents/manuales/';
        case 'hesp_IdImagen':
        default:
            return '/api/documents/';
    }
};

const getDefaultLabelForField = (field: TargetDocumentField): string => {
    switch (field) {
        case 'hesp_IdPlano':
            return 'Cargar Plano';
        case 'hesp_IdManual':
            return 'Cargar Manual';
        case 'hesp_IdImagen':
        default:
            return 'Cargar Archivo / Imagen';
    }
};

const getDefaultSublabelForField = (field: TargetDocumentField): string => {
    switch (field) {
        case 'hesp_IdPlano':
            return 'Soporta planos en formato PDF, DWG, DXF o imágenes';
        case 'hesp_IdManual':
            return 'Soporta manuales en formato PDF, Word o documentos';
        case 'hesp_IdImagen':
        default:
            return 'Soporta imágenes, PDFs, videos y audios';
    }
};

export default function FilesUpload({
    targetField = 'hesp_IdImagen',
    endpoint,
    label,
    sublabel,
    accept,
    maxFiles,
    extraFormData,
    onUploadSuccess
}: FilesUploadProps) {
    const [files, setFiles] = useState<FileWithProgress[]>([]);
    const [uploading, setUploading] = useState(false);
    const { CreatePost } = useAxios();
    const { formData, updateFormData } = useFormData(); // Access to context

    const targetEndpoint = endpoint || getEndpointForField(targetField);
    const displayLabel = label || getDefaultLabelForField(targetField);
    const displaySublabel = sublabel || getDefaultSublabelForField(targetField);

    const onDrop = (acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map((file) => ({
            file,
            progress: 0,
            uploaded: false,
            id: `${file.name}-${Date.now()}-${Math.random()}`,
        }));
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        disabled: uploading,
        Accept: accept || '',
        maxFiles: maxFiles ?? 1,
    });

    const handleUpload = async (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        if (files.length === 0 || uploading) return; // Avoid sending without uploading file

        setUploading(true);
        let lastUploadedId: number | null = null;

        for (const fileItem of files) {
            if (fileItem.uploaded) continue;

            // 1. Create FormData object
            const formDataBody = new FormData();

            // 2. Append selected file and fields
            formDataBody.append("archivo", fileItem.file);
            formDataBody.append("nombre", fileItem.file.name);
            formDataBody.append("descripcion", "Uploaded by user");

            if (extraFormData) {
                Object.entries(extraFormData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formDataBody.append(key, String(value));
                    }
                });
            }

            try {
                // 3. Call CreatePost with targetEndpoint
                const res = await CreatePost(
                    targetEndpoint,
                    "POST",
                    formDataBody,
                    {
                        onUploadProgress: (progressEvent: any) => {
                            const total = progressEvent.total || fileItem.file.size;
                            const percent = Math.round((progressEvent.loaded * 100) / total);
                            setFiles(prev => prev.map(f =>
                                f.id === fileItem.id ? { ...f, progress: percent } : f
                            ));
                        }
                    }
                );

                // 4. Extract ID dynamically based on backend model response keys
                const extractedId =
                    res?.id_imagen ??
                    res?.IdPlano ??
                    res?.id_plano ??
                    res?.IdManual ??
                    res?.id_manual ??
                    res?.id ??
                    res?.im_IdImagen ??
                    res?.pl_IdPlano ??
                    res?.mn_IdManual ??
                    null;

                if (extractedId) {
                    lastUploadedId = Number(extractedId);
                }

                // Update progress bar to completed
                setFiles(prev => prev.map(f =>
                    f.id === fileItem.id ? { ...f, uploaded: true, progress: 100 } : f
                ));
            } catch (err) {
                console.error(`Upload failed for ${fileItem.id} to ${targetEndpoint}:`, err);
            }
        }

        setUploading(false);

        // 5. Save in HerrContext
        if (lastUploadedId) {
            updateFormData({
                ...formData,
                [targetField]: lastUploadedId,
            });
            if (onUploadSuccess) {
                onUploadSuccess(lastUploadedId, targetField);
            }
            console.log(`[FilesUpload] Guardado en Contexto (${targetField}):`, lastUploadedId);
        }
    };

    function removeFile(id: string) {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    }

    function handleClear() {
        setFiles([]);
    }

    return (
        <div className="space-y-4">
            <label className="block p-2 font-bold">{displayLabel}</label>

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[160px] ${isDragActive
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                    }`}
            >
                <input {...getInputProps()} />
                <Upload className={`h-8 w-8 ${isDragActive ? "text-orange-500 animate-bounce" : "text-gray-400"}`} />
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                        {isDragActive
                            ? "Suelte los archivos aquí..."
                            : "Arrastre y suelte sus archivos aquí, o haga clic para seleccionar"}
                    </p>
                    <p className="text-xs text-gray-500">{displaySublabel}</p>
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        open();
                    }}
                    disabled={uploading}
                    className="btn btn-orange flex items-center gap-2 mt-2"
                >
                    <Plus size={18} />
                    Seleccionar archivos
                </button>
            </div>

            <ActionButtons
                disabled={files.length === 0 || uploading}
                uploading={uploading}
                onUpload={handleUpload}
                onClear={handleClear}
            />

            <FileList files={files} onRemove={removeFile} uploading={uploading} />
        </div>
    );
}

//----------------------------------------------------------------------------------------------
type ActionButtonsProps = {
    disabled: boolean;
    uploading: boolean;
    onUpload: () => void;
    onClear: () => void;
};

function ActionButtons({ disabled, uploading, onUpload, onClear }: ActionButtonsProps) {
    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={onUpload}
                disabled={disabled}
                className="btn btn-orange"
            >
                <Upload size={18} />
                {uploading ? "Cargando..." : "Cargar"}
            </button>
            <button
                type="button"
                onClick={onClear}
                className="btn btn-orange"
                disabled={disabled}
            >
                <Trash2 size={18} />
                Eliminar todo
            </button>
        </div>
    );
}

//------------------------------------------------------------------------------------------------
type FileListProps = {
    files: FileWithProgress[];
    onRemove: (id: string) => void;
    uploading: boolean;
};

function FileList({ files, onRemove, uploading }: FileListProps) {
    if (files.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            <h3 className="text-lg font-medium">Archivos:</h3>
            <div className="flex flex-col gap-2">
                {files.map((file) => (
                    <FileItem
                        key={file.id}
                        file={file}
                        onRemove={onRemove}
                        uploading={uploading}
                    />
                ))}
            </div>
        </div>
    );
}

//----------------------------------------------------------------------------------
type FileItemProps = {
    file: FileWithProgress;
    onRemove: (id: string) => void;
    uploading: boolean;
};

function FileItem({ file, onRemove, uploading }: FileItemProps) {
    const Icon = getFileIcon(file.file.type);

    return (
        <div className="space-y-2 rounded-md bg-gray-50 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon size={40} className="text-gray-500" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{file.file.name}</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <span>{formatFileSize(file.file.size)}</span>
                            <span>*</span>
                            <span>{file.file.type || 'Unknown type'}</span>
                        </div>
                    </div>
                </div>
                {!uploading && (
                    <button onClick={() => onRemove(file.id)} className="text-gray-500 hover:text-gray-700">
                        <X size={16} className={"text-white"} />
                    </button>
                )}
            </div>
            <div className="text-right text-xs">
                {file.uploaded ? 'Completado' : `${Math.round(file.progress)}%`}
            </div>
            <ProgressBar progress={file.progress} />
        </div>
    );
}

//-----------------------------------------------------------------------------------------------
type ProgressBarProps = {
    progress: number;
};

function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
            >
            </div>
        </div>
    );
}

const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return FileImage;
    if (mimeType.startsWith('video/')) return FileVideo;
    if (mimeType.startsWith('audio/')) return FileAudio;
    if (mimeType === 'application/pdf') return FileText;
    return FileIcon;
};

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

