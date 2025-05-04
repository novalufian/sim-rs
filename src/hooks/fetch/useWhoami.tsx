// hooks/useWhoami.ts
import api from '@/libs/api'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie';

export const useWhoami = () => {

    const token = Cookies.get('jwt'); 

    if (token) {
        const userInfo = Cookies.get('userInfo');
        if (userInfo) {
            return {
                data: JSON.parse(userInfo), // Returning user data from cookies directly
                isLoading: false,  // No need to load data from API
                error: false,    // No error, since we are using cookie data
            };
        }
    }
    return useQuery({
        queryKey: ['whoami'],
        queryFn: async () => {
        const res = await api.get(`/auth/whoami`)
        return res.data
        },
        staleTime: 1000 * 60 * 60 * 7, // cache for 5 mins
    })
}
