"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import AdminDashboardLayout from "@/components/admin-dashboard-layout"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Analytics {
  totalUsers: number
  totalAuctions: number
  totalBids: number
  totalRevenue: number
  propertyTypeDistribution: { name: string; value: number }[]
  monthlyRevenue: { name: string; revenue: number }[]
  userGrowth: { date: string; users: number }[]
  locationDistribution: { name: string; value: number }[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function ReportsPage() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalAuctions: 0,
    totalBids: 0,
    totalRevenue: 0,
    propertyTypeDistribution: [],
    monthlyRevenue: [],
    userGrowth: [],
    locationDistribution: [],
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Fetch total users
      const usersSnapshot = await getDocs(collection(db, "users"))
      const totalUsers = usersSnapshot.size

      // Fetch total auctions
      const auctionsSnapshot = await getDocs(collection(db, "auctions"))
      const totalAuctions = auctionsSnapshot.size

      // Fetch total bids
      const bidsSnapshot = await getDocs(collection(db, "bids"))
      const totalBids = bidsSnapshot.size

      // Calculate total revenue from successful auctions
      const completedAuctionsQuery = query(collection(db, "auctions"), where("status", "==", "sold"))
      const completedAuctionsSnapshot = await getDocs(completedAuctionsQuery)
      const totalRevenue = completedAuctionsSnapshot.docs.reduce((sum, doc) => sum + doc.data().soldPrice, 0)

      // Get property type distribution
      const propertyTypes = auctionsSnapshot.docs.reduce((acc: { [key: string]: number }, doc) => {
        const type = doc.data().propertyType
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {})

      const propertyTypeDistribution = Object.entries(propertyTypes).map(([name, value]) => ({
        name,
        value,
      }))

      // Get location distribution
      const locations = auctionsSnapshot.docs.reduce((acc: { [key: string]: number }, doc) => {
        const location = doc.data().location
        acc[location] = (acc[location] || 0) + 1
        return acc
      }, {})

      const locationDistribution = Object.entries(locations).map(([name, value]) => ({
        name,
        value,
      }))

      // Generate monthly revenue data (example data)
      const monthlyRevenue = [
        { name: "Jan", revenue: 4000 },
        { name: "Feb", revenue: 3000 },
        { name: "Mar", revenue: 5000 },
        { name: "Apr", revenue: 4500 },
        { name: "May", revenue: 6000 },
        { name: "Jun", revenue: 5500 },
      ]

      // Generate user growth data (example data)
      const userGrowth = [
        { date: "Week 1", users: 100 },
        { date: "Week 2", users: 150 },
        { date: "Week 3", users: 200 },
        { date: "Week 4", users: 280 },
        { date: "Week 5", users: 350 },
        { date: "Week 6", users: 400 },
      ]

      setAnalytics({
        totalUsers,
        totalAuctions,
        totalBids,
        totalRevenue,
        propertyTypeDistribution,
        monthlyRevenue,
        userGrowth,
        locationDistribution,
      })
    }

    fetchAnalytics()
  }, [])

  return (
    <AdminDashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Analytics & Reports</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Auctions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.totalAuctions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.totalBids}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">€{analytics.totalRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Property Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.propertyTypeDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {analytics.propertyTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.locationDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {analytics.locationDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  )
}

