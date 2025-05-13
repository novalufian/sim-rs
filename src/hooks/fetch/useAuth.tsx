import api from '@/libs/api'
import { useMutation } from '@tanstack/react-query'

export const useAuth = () => {
    return useMutation({
        mutationFn: async (formData: any) => {
            console.log(formData)
            const res = await api.post('/auth/login', formData)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Laporan berhasil dikirim!', data)
            // You can trigger toast here or redirect
        },
        onError: (error: any) => {
            if (error.response) {
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
