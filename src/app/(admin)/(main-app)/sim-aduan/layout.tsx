import React from 'react'
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'SIM-ADUAN',
  description: 'Sistem Informasi Pengaduan',
}

function layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="">
        {children}
        </div>
    );
}

export default layout