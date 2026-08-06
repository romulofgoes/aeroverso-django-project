'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        if (!token) {
            router.replace('/admin/management')
            return
        }
        setAuthorized(true)
    }, [router])

    if (!authorized) {
        return null
    }

    return (
        <>
            <div className="sticky top-0 z-40 bg-navy-900 border-b border-navy-700">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link
                        href="/admin/management/dashboard"
                        className="text-sm text-slate-300 hover:text-cyan-glow transition-colors"
                    >
                        ← Painel
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-sm font-medium text-slate-300 hover:text-white border border-navy-700 hover:border-slate-500 rounded-lg px-3 py-1.5 transition-colors"
                    >
                        Sair
                    </button>
                </div>
            </div>
            {children}
        </>
    )
}
