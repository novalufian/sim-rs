"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

interface DefaultModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: () => void;
    showWrapper?: boolean; // optional wrapper
}

export default function DefaultModal({
isOpen,
onClose,
}: DefaultModalProps) {

    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-[600px] p-5 lg:p-10"
        >
            <h4 className="font-semibold text-green-800 mb-7 text-title-sm dark:text-white/90">
                Aduan Berhasil Dikirim
            </h4>
            <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                Aduan anda sudah berhasil dikirim. Terima kasih atas partisipasi anda.
                <br />
                Silahkan tunggu konfirmasi dari admin.
                <br />
                Anda juga bisa melihat status aduan anda di halaman <strong>Riwayat Aduan</strong>.
            </p>
            <div className="flex items-center justify-end w-full gap-3 mt-8">
                <Button size="sm" variant="outline" onClick={onClose}>
                Close
                </Button>
            </div>
        </Modal>
    );
}
