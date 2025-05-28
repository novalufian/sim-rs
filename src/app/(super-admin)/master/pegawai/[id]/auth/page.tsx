    "use client"
    import AuthForm from '@/components/form/(main-app)/profile/auth'
    import React from 'react'

    // Option 1: Define proper types for your props
    interface PageProps {
    params: Promise<{
        id: string;
    }>;
    }

    async function Page({ params }: PageProps) {
        const { id } = await params;
    return (
        <>
        <AuthForm pegawaiId={id || ""} />
        </>
    )
    }

    export default Page;