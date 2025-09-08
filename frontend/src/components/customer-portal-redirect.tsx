"use client"
import { useEffect } from "react"
import { authClient } from "~/lib/auth-client"


export default function CustomerPortalRedirect() {
    useEffect(() => {
     const portal = async () => {
        await authClient.customer.portal()
     }
        void portal()
    }, [])
    
    return (
        <div className="flex h-full items-center justify-center w-full">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    )
}