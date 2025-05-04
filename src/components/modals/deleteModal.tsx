"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useAduanDelete } from "@/hooks/fetch/useAduan";
import SpinerLoading from "../loading/spiner";

interface DeleteModalProps {
    isOpen: boolean;
    laporanId?: string | null;
    onClose: () => void;
    onSave?: () => void;
    onConfirm?: () => void;
    showWrapper?: boolean;
}

export default function DeleteModal({
    isOpen,
    laporanId,
    onClose,
    onConfirm,
}: DeleteModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mutateAsync: deleteLaporan, isPending, isError, isSuccess } = useAduanDelete();

    useEffect(() => {
        if (isSuccess && !isSubmitting) {
            const timer = setTimeout(() => {
                onClose();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, isSubmitting, onClose]);

    const handleDelete = async () => {
        if (!laporanId) return;
        
        setIsSubmitting(true);
        try {
            await deleteLaporan(laporanId);
            onConfirm?.();
        } catch (error) {
            console.error("Error deleting laporan:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[500px] p-5 lg:p-10 bg-red-100"
        >
            <span className="text-gray-300 text-xs">#{laporanId}</span>
            <h4 className="font-semibold text-red-800 mb-7 text-title-sm dark:text-white/90">
                Konfirmasi
            </h4>
            {isPending ? (
                <SpinerLoading />
            ) : (
                <p className="text-lg leading-6 text-red-500 dark:text-gray-400">
                    Apakah anda yakin ingin menghapus aduan ini?
                </p>
            )}
            <div className="flex items-center justify-end w-full gap-3 mt-8">
                <Button disabled={isPending} size="sm" variant="outline" onClick={onClose}>
                    Close
                </Button>
                <Button size="sm" variant="outline" onClick={handleDelete} disabled={isPending}>
                    {isPending ? (
                        <svg
                            className="animate-spin h-5 w-5 mr-3 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8l4 4a8 8 0 01-8 8v-8z"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                    Ya, Hapus aduan
                </Button>
            </div>
        </Modal>
    );
}
