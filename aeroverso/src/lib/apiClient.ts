import { tokenService } from "@/services/tokenService"


const request = async (endpoint: string, config: RequestInit = {}) => {
    const accessToken = localStorage.getItem('access_token')

    const doFetch = (token: string | null) => 
        fetch(endpoint, {
            ...config,
            headers: {
                ...config.headers,
                ...(token && {Authorization: `Bearer ${token}`}),
            },
        })
    let response = await doFetch(accessToken)
    if (response.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
            localStorage.clear()
            window.location.href='/admin/management'
            throw new Error('Sessão expirada')
        }
        try {
            const { access } = await tokenService.getNewToken(refreshToken)
            localStorage.setItem('access_token', access)
            response = await doFetch(access)
        } catch {
            localStorage.clear()
            window.location.href='/admin/mamagement'
            throw new Error('Sessão expirada')
        }

        if (!response.ok) throw new Error (`Erro ${response.status}`)
        return response.json()
    }

}

export const apiClient = {request}