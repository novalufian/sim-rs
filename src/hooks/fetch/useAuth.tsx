import api from '@/libs/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie';

export const useAuth = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: any) => {
            const res = await api.post('/auth/login', formData)
            return res.data
        },
        onSuccess: async (data) => {
            console.log('✅ Login successful!', data) // Changed message for clarity
            Cookies.set('token', data.token, { expires: 7 });

            // Invalidate 'whoami' to refetch user data if applicable
            await queryClient.invalidateQueries({ queryKey: ['whoami'] });
            // You might want to redirect the user here or handle it in the component
        },
        onError: (error: any) => {
            // This onError is useful for side effects like logging,
            // but the error itself is also available in the component.
            if (error.code === 'ECONNREFUSED') {
                console.error("🔴 Backend server is not running or unreachable!");
                console.error("Check if the backend is running on http://192.168.1.4:3001");
            } else if (error.response) {
                const message = error.response.data?.message || 'Unknown error';
                const validationErrors = error.response.data?.data; // Assuming 'data' contains validation errors
                console.error("🛑 API Error:", message);

                if (Array.isArray(validationErrors)) {
                    validationErrors.forEach((err: any) => {
                    console.error(`🔸 Validation Error: ${err.path?.join('.') || 'N/A'} - ${err.message}`);
                    });
                }
            } else {
                console.error("❌ Unexpected error:", error);
            }
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: any) => {
            console.log(formData)
            const res = await api.post('/user', formData)
            return res.data
        },
        onSuccess: async (data) => {
            console.log('✅ Register successful!', data) // Changed message for clarity

        },
        onError: (error: any) => {
            // This onError is useful for side effects like logging,
            // but the error itself is also available in the component.
            if (error.code === 'ECONNREFUSED') {
                console.error("🔴 Backend server is not running or unreachable!");
                console.error("Check if the backend is running on http://192.168.1.4:3001");
            } else if (error.response) {
                const message = error.response.data?.message || 'Unknown error';
                const validationErrors = error.response.data?.data; // Assuming 'data' contains validation errors
                console.error("🛑 API Error:", message);

                if (Array.isArray(validationErrors)) {
                    validationErrors.forEach((err: any) => {
                    console.error(`🔸 Validation Error: ${err.path?.join('.') || 'N/A'} - ${err.message}`);
                    });
                }
            } else {
                console.error("❌ Unexpected error:", error);
            }
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: any) => {
            const res = await api.put('/user', formData)
            return res.data
        },
        onSuccess: async (data) => {
            console.log('✅ Update user successful!', data) // Changed message for clarity
            Cookies.set('token', data.token, { expires: 7 });

            // Invalidate 'whoami' to refetch user data if applicable
            await queryClient.invalidateQueries({ queryKey: ['whoami'] });
            // You might want to redirect the user here or handle it in the component
        },
        onError: (error: any) => {
            // This onError is useful for side effects like logging,
            // but the error itself is also available in the component.
            if (error.code === 'ECONNREFUSED') {
                console.error("🔴 Backend server is not running or unreachable!");
                console.error("Check if the backend is running on http://192.168.1.4:3001");
            } else if (error.response) {
                const message = error.response.data?.message || 'Unknown error';
                const validationErrors = error.response.data?.data; // Assuming 'data' contains validation errors
                console.error("🛑 API Error:", message);

                if (Array.isArray(validationErrors)) {
                    validationErrors.forEach((err: any) => {
                    console.error(`🔸 Validation Error: ${err.path?.join('.') || 'N/A'} - ${err.message}`);
                    });
                }
            } else {
                console.error("❌ Unexpected error:", error);
            }
        },
    });
};

export const useGetUserByPegawaiId = (pegawaiId: string) => {
    const queryClient = useQueryClient();
    
    return useQuery({
        queryKey: ['getUserByPegawaiId', pegawaiId], // Include pegawaiId in queryKey
        queryFn: async () => {
            try {
                const res = await api.get(`/user/${pegawaiId}`);
                
                // If response is empty but status is 200
                if (!res.data) {
                    throw new Error('User not found');
                }
                
                return res.data;
            } catch (error: any) {
                if (error.response?.status === 404) {
                    // Return null or special object for "not found"
                    return null;
                }
                throw error; // Re-throw other errors
            }
        },
        staleTime: 1000 * 60 * 20, // 20 minutes cache
        refetchOnWindowFocus: false,
        refetchInterval: false,
        enabled: !!pegawaiId, // Only run query if pegawaiId exists
        retry: (failureCount, error: any) => {
            // Don't retry for 404 errors
            if (error.response?.status === 404) return false;
            return failureCount < 3; // Retry others up to 3 times
        }
    });
};

export const disableUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (pegawaiId: string) => {
            const res = await api.delete(`/user/${pegawaiId}`)
            return res.data
        },
        onSuccess: async (data) => {
            console.log('✅ Disable user successful!', data) // Changed message for clarity
            Cookies.set('token', data.token, { expires: 7 });

            // Invalidate 'whoami' to refetch user data if applicable
            await queryClient.invalidateQueries({ queryKey: ['whoami'] });
            // You might want to redirect the user here or handle it in the component
        },
        onError: (error: any) => {
            // This onError is useful for side effects like logging,
            // but the error itself is also available in the component.
            if (error.code === 'ECONNREFUSED') {
                console.error("🔴 Backend server is not running or unreachable!");
                console.error("Check if the backend is running on http://192.168.1.4:3001");
            } else if (error.response) {
                const message = error.response.data?.message || 'Unknown error';
                const validationErrors = error.response.data?.data; // Assuming 'data' contains validation errors
                console.error("🛑 API Error:", message);

                if (Array.isArray(validationErrors)) {
                    validationErrors.forEach((err: any) => {
                    console.error(`🔸 Validation Error: ${err.path?.join('.') || 'N/A'} - ${err.message}`);
                    });
                }
            } else {
                console.error("❌ Unexpected error:", error);
            }
        },
    });
};

export const enableUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (pegawaiId: string) => {
            const res = await api.put(`/user/${pegawaiId}`)
            return res.data
        },
        onSuccess: async (data) => {
            console.log('✅ Enable user successful!', data) // Changed message for clarity
            Cookies.set('token', data.token, { expires: 7 });

            // Invalidate 'whoami' to refetch user data if applicable
            await queryClient.invalidateQueries({ queryKey: ['whoami'] });
            // You might want to redirect the user here or handle it in the component
        },
        onError: (error: any) => {
            // This onError is useful for side effects like logging,
            // but the error itself is also available in the component.
            if (error.code === 'ECONNREFUSED') {
                console.error("🔴 Backend server is not running or unreachable!");
                console.error("Check if the backend is running on http://192.168.1.4:3001");
            } else if (error.response) {
                const message = error.response.data?.message || 'Unknown error';
                const validationErrors = error.response.data?.data; // Assuming 'data' contains validation errors
                console.error("🛑 API Error:", message);

                if (Array.isArray(validationErrors)) {
                    validationErrors.forEach((err: any) => {
                    console.error(`🔸 Validation Error: ${err.path?.join('.') || 'N/A'} - ${err.message}`);
                    });
                }
            } else {
                console.error("❌ Unexpected error:", error);
            }
        },
    });
};