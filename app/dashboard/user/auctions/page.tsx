"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/firebase"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"
import { Timestamp } from "firebase/firestore" // Import for Firestore timestamps

interface Auction {
  id: string
  title: string
  currentBid: number
  endDate: string | null
  status: "active" | "upcoming" | "past"
}

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [filter, setFilter] = useState<"active" | "upcoming" | "past">("active")

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const auctionsRef = collection(db, "auctions")
        const q = query(auctionsRef, where("status", "==", filter))
        const querySnapshot = await getDocs(q)

        const fetchedAuctions = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title || "Untitled Auction",
            currentBid: typeof data.currentBid === "number" ? data.currentBid : 0, // Ensure it's a number
            endDate: data.endDate
              ? data.endDate instanceof Timestamp
                ? new Date(data.endDate.toDate()).toISOString() // Convert Firestore Timestamp
                : new Date(data.endDate).toISOString() // Convert stored string date
              : null,
            status: data.status || "active",
          } as Auction
        })

        console.log("Fetched Auctions:", fetchedAuctions) // Debugging

        setAuctions(fetchedAuctions)
      } catch (error) {
        console.error("Error fetching auctions:", error)
      }
    }

    fetchAuctions()
  }, [filter])

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Auctions</h1>
        <Tabs defaultValue="active" onValueChange={(value) => setFilter(value as "active" | "upcoming" | "past")}>
          <TabsList>
            <TabsTrigger value="active">Active Auctions</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Auctions</TabsTrigger>
            <TabsTrigger value="past">Past Auctions</TabsTrigger>
          </TabsList>

          {["active", "upcoming", "past"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.length === 0 ? (
                  <p className="text-gray-500">No {tab} auctions available.</p>
                ) : (
                  auctions.map((auction) => (
                    <Card key={auction.id}>
                      <CardHeader>
                        <CardTitle>{auction.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          {tab === "past"
                            ? `Winning Bid: €${auction.currentBid.toLocaleString()}`
                            : `Current Bid: €${auction.currentBid.toLocaleString()}`}
                        </p>
                        <p>
                          {tab === "upcoming"
                            ? `Starts: ${auction.endDate ? new Date(auction.endDate).toLocaleString() : "TBD"}`
                            : `Ends: ${auction.endDate ? new Date(auction.endDate).toLocaleString() : "TBD"}`}
                        </p>
                        {tab === "upcoming" ? (
                          <Button className="mt-4" disabled>
                            Coming Soon
                          </Button>
                        ) : tab === "past" ? (
                          <Button className="mt-4" disabled>
                            Auction Closed
                          </Button>
                        ) : (
                          <Link href={`/auctions/${auction.id}`}>
                            <Button className="mt-4">View Auction</Button>
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

