'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

    return <>{children}</>
}
