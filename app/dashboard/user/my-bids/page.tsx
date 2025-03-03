"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, query, where, getDocs } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { auth, db } from "@/lib/firebase"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"

interface Bid {
  id: string
  auctionId: string
  auctionTitle: string
  amount: number
  timestamp: string
  status: "active" | "won" | "lost"
}

export default function MyBidsPage() {
  const [user] = useAuthState(auth)
  const [bids, setBids] = useState<Bid[]>([])

  useEffect(() => {
    const fetchBids = async () => {
      if (!user) return

      const bidsRef = collection(db, "bids")
      const q = query(bidsRef, where("userId", "==", user.uid))
      const querySnapshot = await getDocs(q)
      const fetchedBids = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Bid)
      setBids(fetchedBids)
    }

    fetchBids()
  }, [user])

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">My Bids</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bids.map((bid) => (
            <Card key={bid.id}>
              <CardHeader>
                <CardTitle>{bid.auctionTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Bid Amount: €{bid.amount.toLocaleString()}</p>
                <p>Date: {new Date(bid.timestamp).toLocaleString()}</p>
                <p>Status: {bid.status}</p>
                <Link href={`/auctions/${bid.auctionId}`}>
                  <Button className="mt-4">View Auction</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

