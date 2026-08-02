'use client'

import CreateAuthor from '@/components/CreateAuthor'
import CreateCategory from '@/components/CreateCategory'
import CreateArticle from '@/components/CreateArticle'
import React, { useEffect } from 'react'
import { tokenService } from '@/services/tokenService'


export default function LoginPage() {
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
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
            console.log(token);
            console.log(refreshToken);
            window.location.href = '/admin/management/dashboard';
        } catch(e) {
            console.log(e || 'Credenciais inválidas')
        }
    };  
  return (
    <main className="min-h-screen bg-navy-950 py-10 px-4">
        <div className="max-w-5xl mx-auto mb-8">
            <h1 className="text-3xl font-extrabold mb-8 text-center">
                Painel de Login
            </h1>
            <form onSubmit={handleSubmit} >
                <h2>Admin Portal</h2>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    className="bg-gray-50"
                    type="text"
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    className="bg-gray-50"
                    type="password"
                    required
                />

                <button type="submit">Submit</button>
            </form>
      </div>
    </main>
  )
}
