"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { updateAduanStatus } from "@/hooks/fetch/useAduan";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "next/navigation";


const formSchema = z.object({
    status: z.enum(["ON_PROGRESS", "OPEN", "CLOSE"]),
    note: z.string().min(1, { message: "Catatan tidak boleh kosong" }),
});

type FormValues = z.infer<typeof formSchema>;

interface UpdateProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UpdateProgressModal({
    isOpen,
    onClose,
}: UpdateProgressModalProps) {
    const { register, handleSubmit, formState, reset } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        status: "ON_PROGRESS",
        note: "",
        },
    });
    const params = useParams();
    const aduanId = params?.id as string;
    const { errors } = formState;
    const { mutate, isPending } = updateAduanStatus();

    const onSubmit = (data: FormValues) => {
        mutate(
        { id: aduanId, formData: data },
        {
            onSuccess: () => {
            reset();
            onClose();
            },
        }
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
        <h4 className="font-semibold text-green-800 mb-7 text-title-sm dark:text-white/90">
            Update Status Aduan
        </h4>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">
                Status
            </label>
            <select
                {...register("status")}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:ring-green-400"
            >
                <option value="ON_PROGRESS">On Progress</option>
                <option value="OPEN">Open</option>
                <option value="CLOSE">Close</option>
            </select>
            </div>

            <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">
                Catatan / Note
            </label>
            <textarea
                {...register("note")}
                rows={4}
                placeholder="Masukkan catatan..."
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:ring-green-400"
            />
            {errors.note && (
                <p className="text-sm text-red-500 mt-1">{errors.note.message}</p>
            )}
            </div>

            <div className="flex justify-end gap-3 pt-6">
            <Button btntype="button" variant="outline" size="sm" onClick={onClose}>
                Batal
            </Button>
            <Button btntype="submit" size="sm" disabled={isPending}> 
                {isPending ? "Mengupdate..." : "Update"}
            </Button>
            </div>
        </form>
        </Modal>
    );
}
