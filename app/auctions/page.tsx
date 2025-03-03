"use client"

import { useState, useEffect } from "react"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface Auction {
  id: string
  title: string
  description: string
  currentBid: number
  endDate: Date
  status: "active" | "upcoming" | "ended"
  images: string[]
}

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([])

  useEffect(() => {
    const fetchAuctions = async () => {
      const auctionsRef = collection(db, "auctions")
      const q = query(auctionsRef, where("status", "in", ["active", "upcoming"]), orderBy("endDate", "asc"))
      const querySnapshot = await getDocs(q)
      const fetchedAuctions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        endDate: doc.data().endDate.toDate(),
      })) as Auction[]
      setAuctions(fetchedAuctions)
    }

    fetchAuctions()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Properties for Auction</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <Card key={auction.id}>
            <Image
              src={auction.images[0] || "/placeholder.svg"}
              alt={auction.title}
              width={400}
              height={300}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <CardHeader>
              <CardTitle>{auction.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{auction.description.substring(0, 100)}...</p>
              <p className="mb-2">Current Bid: €{auction.currentBid.toLocaleString()}</p>
              <p className="mb-4">Ends: {auction.endDate.toLocaleString()}</p>
              <Link href={`/auctions/${auction.id}`}>
                <Button>View Auction</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

