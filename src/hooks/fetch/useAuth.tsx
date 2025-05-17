import api from '@/libs/api'
import { useMutation } from '@tanstack/react-query'

export const useAuth = () => {
    return useMutation({
        mutationFn: async (formData: any) => {
            const res = await api.post('/auth/login', formData)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Laporan berhasil dikirim!', data)
            // You can trigger toast here or redirect
        },
        onError: (error: any) => {
            if (error.code === 'ECONNREFUSED') {
                console.error("🔴 Backend server is not running or unreachable!");
                console.error("Check if the backend is running on http://192.168.1.4:3001");
              } else if (error.response) {
                const message = error.response.data?.message || 'Unknown error'
                const validationErrors = error.response.data?.data
                console.log("🛑 Validation error:", message)

                if (Array.isArray(validationErrors)) {
                    validationErrors.forEach((err: any) => {
                    console.error(`🔸 ${err.path.join('.')} - ${err.message}`)
                    })
                }
            } else {
                console.log("❌ Unexpected error:", error)
            }
        },
    })
}
