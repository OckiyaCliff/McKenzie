"use client"

import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Gavel, Clock, Trophy, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UserDashboardPage() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const [stats, setStats] = useState({
    totalBids: 0,
    activeAuctions: 0,
    wonAuctions: 0,
    watchlistCount: 0,
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

        const bidsQuery = query(collection(db, "bids"), where("userId", "==", user.uid))
        const bidsSnapshot = await getDocs(bidsQuery)

        const activeAuctionsQuery = query(collection(db, "auctions"), where("status", "==", "active"))
        const activeAuctionsSnapshot = await getDocs(activeAuctionsQuery)

        const wonAuctionsQuery = query(
          collection(db, "auctions"),
          where("status", "==", "ended"),
          where("winnerId", "==", user.uid),
        )
        const wonAuctionsSnapshot = await getDocs(wonAuctionsQuery)

        const watchlistQuery = query(collection(db, "watchlist"), where("userId", "==", user.uid))
        const watchlistSnapshot = await getDocs(watchlistQuery)

        setStats({
          totalBids: bidsSnapshot.size,
          activeAuctions: activeAuctionsSnapshot.size,
          wonAuctions: wonAuctionsSnapshot.size,
          watchlistCount: watchlistSnapshot.size,
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
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
              <Gavel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBids}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAuctions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Won Auctions</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.wonAuctions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.watchlistCount}</div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/auctions">
              <Button className="w-full">Browse Auctions</Button>
            </Link>
            <Link href="/dashboard/user/list-property">
              <Button className="w-full">List a Property</Button>
            </Link>
            <Link href="/dashboard/user/watchlist">
              <Button className="w-full">View Watchlist</Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

