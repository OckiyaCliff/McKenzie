"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import AdminDashboardLayout from "@/components/admin-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Users, Home, DollarSign, Gavel } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboardPage() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAuctions: 0,
    totalBids: 0,
    activeAuctions: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const usersSnapshot = await getDocs(collection(db, "users"))
        const auctionsSnapshot = await getDocs(collection(db, "auctions"))
        const bidsSnapshot = await getDocs(collection(db, "bids"))
        const activeAuctionsSnapshot = await getDocs(query(collection(db, "auctions"), where("status", "==", "active")))

        setStats({
          totalUsers: usersSnapshot.size,
          totalAuctions: auctionsSnapshot.size,
          totalBids: bidsSnapshot.size,
          activeAuctions: activeAuctionsSnapshot.size,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        toast({
          title: "Error",
          description: "Unable to fetch dashboard data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [user])

  if (loading || isLoading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminDashboardLayout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <AdminDashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Auctions</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAuctions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBids}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
              <Gavel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAuctions}</div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/dashboard/admin/users">
              <Button className="w-full">Manage Users</Button>
            </Link>
            <Link href="/dashboard/admin/auctions">
              <Button className="w-full">Manage Auctions</Button>
            </Link>
            <Link href="/dashboard/admin/reports">
              <Button className="w-full">View Reports</Button>
            </Link>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  )
}

