"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

interface DefaultModalProps {
    isOpen: boolean;
    isFooter?: boolean;
    onClose: () => void;
    onSave?: () => void;
    showWrapper?: boolean; // optional wrapper
    children?: React.ReactNode;

}

export default function ModalCustom({
isOpen,
isFooter,
onClose,
children
}: DefaultModalProps) {

    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-[800px] p-5 lg:p-10 "
        >
            <div className="flex flex-col gap-3 mb-10">
                {children}
            </div>
            {isFooter && <div className="flex items-center justify-end w-full gap-3 mt-8">
                <Button size="sm" variant="outline" onClick={onClose}>
                Tutup
                </Button>
                <Button size="sm" variant="outline" onClick={onClose}>
                Terapkan
                </Button>
            </div>}
        </Modal>
    );
}
