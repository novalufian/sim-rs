import LoadDataLoading from '@/components/loading/loadData'
import React from 'react'

async function Page({params}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return (
        <div className='rounded-2xl min-h-[450px] flex justify-center items-center flex-col'>
            <LoadDataLoading />
        </div>
    )
}

export default Page