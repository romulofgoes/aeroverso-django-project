'use client'

import React, { useState } from 'react'
import { tokenService } from '@/services/tokenService'

export default function LoginPage() {
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('')
        setIsSubmitting(true)
        // FIX: read straight from the DOM instead of React state — autofill
        // doesn't fire onChange, so controlled state can end up empty.
        const data = new FormData(e.currentTarget as HTMLFormElement)
        const username = data.get('username') as string
        const password = data.get('password') as string
        try {
            const res = await tokenService.getToken(username, password);
            const token = res.access;
            const refreshToken = res.refresh;
            localStorage.setItem('access_token', token);
            localStorage.setItem('refresh_token', refreshToken);
            window.location.href = '/admin/management/dashboard';
        } catch {
            setError('Usuário ou senha inválidos.')
            setIsSubmitting(false)
        }
    };
    return (
        <main className="min-h-screen bg-navy-950 flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-bold text-white text-center mb-6">
                    Painel de Administração
                </h1>
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                        Entrar
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Usuário
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-600">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg shadow-sm transition-all"
                        >
                            {isSubmitting ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}
