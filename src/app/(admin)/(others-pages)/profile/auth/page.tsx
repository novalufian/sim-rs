"use client";
import AuthForm from '@/components/form/(main-app)/profile/auth'
import { useAppSelector } from '@/hooks/useAppDispatch';
import { RootState } from '@/libs/store';
import React from 'react'

function page() {
    const user = useAppSelector((state: RootState) => state.auth.user);
    if(!user) return <div>Loading...</div>

    return (
        <>
            <AuthForm pegawaiId={user?.id} isProfile={true} />
        </>
    )
}

export default page