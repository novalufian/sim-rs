"use client";
import React from 'react';
import PegawaiProfile from '@/components/form/(main-app)/profile/pegawaiProfile';
import { useParams } from 'next/navigation';

export default function Page() {
    const params = useParams();
    const { id } = params ;
    return (
        <>
            <PegawaiProfile userId={id as string} />
        </>
    );
}
