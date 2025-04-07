import ComingSoon from '@/components/soon/page'
import type { Metadata } from 'next'
import React from 'react'
export const metadata: Metadata = {
    title: 'Sim Keuangan',
    keywords: ['Sim Keuangan', 'Keuangan', 'Aplikasi Keuangan'],
    description: 'Sim Keuangan adalah aplikasi untuk mengelola keuangan Anda dengan mudah dan efisien.'
}

function page() {
    return (
        <div>
            <ComingSoon title="Sim Keuangan" />
        </div>
    )
}

export default page