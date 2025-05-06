import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3001/api/"
})

/*
!! interseptors
    - set header globaly, so we not to need set header in every request page
 */
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = getCookie('token')
        if (token) {
        config.headers.authorization = `Bearer ${token}`
        }
    }
    return config
})

function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export default api
