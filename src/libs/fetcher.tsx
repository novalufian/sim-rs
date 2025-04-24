// lib/fetcher.ts
export const authorizedFetch = async (
    url: string,
    options: RequestInit = {}
    ) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    const res = await fetch(url, { ...options, headers })

    if (!res.ok) {
        throw new Error('Failed to fetch')
    }

    return res.json()
}
