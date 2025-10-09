"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface UploadIjazahProps {
    onFileChange: (file: File | null) => void;
    defaultPreview?: string | null;
    title?: string;
}

export default function UploadIjazah({
    onFileChange,
    defaultPreview = null,
    title = "Upload Ijazah",
}: UploadIjazahProps) {
    const [filePreview, setFilePreview] = useState<string | null>(defaultPreview);
    const [fileName, setFileName] = useState<string | null>(null);
    
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;
            
            // ✅ Validasi ukuran maksimal 2MB
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran file maksimal 2MB!");
                return;
            }
            
            // ✅ Validasi tipe file
            const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
            if (!allowedTypes.includes(file.type)) {
                alert("Hanya file JPG, PNG, atau PDF yang diperbolehkan!");
                return;
            }
            
            // ✅ Jika file gambar → buat preview
            if (file.type.startsWith("image/")) {
                const previewUrl = URL.createObjectURL(file);
                setFilePreview(previewUrl);
            } else {
                // PDF tidak bisa ditampilkan langsung
                setFilePreview(null);
            }
            
            setFileName(file.name);
            onFileChange(file);
        },
        [onFileChange]
    );
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg"],
            "application/pdf": [".pdf"],
        },
    });
    
    // 🧹 Clean up blob preview
    useEffect(() => {
        return () => {
            if (filePreview && filePreview.startsWith("blob:")) {
                URL.revokeObjectURL(filePreview);
            }
        };
    }, [filePreview]);
    
    return (
        <div className="space-y-2 px-5">
        <p className="pb-2 font-medium text-gray-700">{title}</p>
        
        {/* Dropzone area */}
        <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
        ${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400"}`}
            >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p className="text-blue-500 font-medium">Lepaskan file di sini...</p>
            ) : (
                !fileName ? (<p className="text-gray-500 text-sm">
                Seret & lepaskan file ke sini, atau{" "}
                <span className="text-blue-600 underline">klik untuk pilih file</span>
                <br />
                (Format: JPG, PNG, PDF • Maks: 2MB)
                </p>) : filePreivew(fileName)
            )}
            
            {/* Jika sudah upload file, tampilkan di dalam box */}
            {fileName && (
                <div className="mt-4 flex flex-col items-center text-sm text-gray-600">
                {filePreview ? (
                    <img
                    src={filePreview}
                    alt="Preview"
                    className="rounded-lg border mt-2 w-40 h-auto"
                    />
                ) : (
                    <p className="text-gray-400 text-xs mt-1">
                    (click disini untuk mengganti)
                    </p>
                )}
                </div>
            )}
            </div>
            
            {/* Tampilkan file lama jika belum ada file baru */}
            {defaultPreview && !fileName && (
                <button
                type="button"
                className="text-blue-500 text-sm underline mt-2"
                onClick={() => window.open(defaultPreview, "_blank")}
                >
                Lihat file lama
                </button>
            )}
            </div>
        );
    }
    

    function filePreivew(fileName : string) {
        return <>
        <div className="w-40 h-20 blcok m-auto bg-white rounded-xl p-6 border border-gray-200 flex flex-col justify-center items-center shadow-lg cursor-pointer">
            <p>📄 {fileName}</p>
        </div>
        </>

    }