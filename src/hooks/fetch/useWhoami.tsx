// hooks/useWhoami.ts
import api from '@/libs/api'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie';  // Import js-cookie

export const useWhoami = () => {
    // Read token from cookie - try multiple methods for compatibility
    const getToken = (): string | undefined => {
        if (typeof window === 'undefined') return undefined;
        
        // Try js-cookie first (works for most cases)
        let token: string | undefined = Cookies.get('token');
        
        // Fallback to document.cookie if js-cookie fails (for sameSite: 'none' cookies with ngrok)
        if (!token && typeof document !== 'undefined') {
            try {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; token=`);
                if (parts.length === 2) {
                    const extractedToken = parts.pop()?.split(';').shift()?.trim();
                    token = extractedToken || undefined;
                }
            } catch (e) {
                console.error('Error reading cookie:', e);
            }
        }
        
        // Debug logging (only in development)
        if (process.env.NODE_ENV === 'development') {
            if (token) {
                console.log('✅ Token found in cookie:', token.substring(0, 20) + '...');
            } else {
                console.warn('⚠️ Token not found in cookie. Available cookies:', document.cookie);
            }
        }
        
        return token;
    };
    
    const token = getToken();
    
    return useQuery({
        queryKey: ['whoami'],
        queryFn: async () => {
            try{
                const res = await api.get(`/auth/whoami`)
                return res.data
            } catch (error: any) {
                console.error('❌ Whoami error:', error);
                return error.response?.data || { success: false, message: 'Failed to fetch user data' };
            }
        },
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        enabled: !!token,
        retry: 1, // Retry once if failed
    })
}

export const useWhoamiWithCache = () => {
    return useQuery({
        queryKey: ['whoami'],
        queryFn: async () => {
            const res = await api.get(`/auth/whoami`)
            return res.data
        },
        staleTime: 1000 , // cache for 5 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}
