"use client"

import { useAuth } from "@/lib/hooks/use-auth"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userData, isAdmin, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
        return
      }

      if (userData) {
        const isInAdminRoute = pathname?.startsWith("/dashboard/admin")
        
        // Redirect admin to admin dashboard
        if (isAdmin && !isInAdminRoute) {
          router.push("/dashboard/admin")
          return
        }
        
        // Redirect regular users to user dashboard
        if (!isAdmin && isInAdminRoute) {
          router.push("/dashboard/user")
          return
        }
      }
    }
  }, [user, userData, isAdmin, loading, router, pathname])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
