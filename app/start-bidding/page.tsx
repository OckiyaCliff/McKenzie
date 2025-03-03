"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { auth, db } from "@/lib/firebase"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Clock, MapPin } from "lucide-react"

interface Auction {
  id: string
  title: string
  description: string
  currentBid: number
  endTime: { seconds: number; nanoseconds: number }
  location: string
  image: string
}

export default function StartBiddingPage() {
  const [user] = useAuthState(auth)
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceFilter, setPriceFilter] = useState("")

  useEffect(() => {
    const fetchAuctions = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const q = query(collection(db, "auctions"), where("status", "==", "active"), orderBy("endTime", "asc"))
        const querySnapshot = await getDocs(q)
        const fetchedAuctions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Auction[]
        setAuctions(fetchedAuctions)
      } catch (error) {
        console.error("Error fetching auctions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAuctions()
  }, [user])

  const filteredAuctions = auctions.filter((auction) => {
    const matchesSearch =
      auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPrice =
      priceFilter === "" ||
      (priceFilter === "0-100000" && auction.currentBid <= 100000) ||
      (priceFilter === "100000-500000" && auction.currentBid > 100000 && auction.currentBid <= 500000) ||
      (priceFilter === "500000+" && auction.currentBid > 500000)

    return matchesSearch && matchesPrice
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Start Bidding</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="Search auctions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/2"
        />
        <Select onValueChange={setPriceFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All prices</SelectItem>
            <SelectItem value="0-100000">€0 - €100,000</SelectItem>
            <SelectItem value="100000-500000">€100,000 - €500,000</SelectItem>
            <SelectItem value="500000+">€500,000+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuctions.map((auction) => (
          <Card key={auction.id}>
            <Image
              src={auction.image || "/placeholder.svg"}
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
              <div className="flex items-center text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{auction.location}</span>
              </div>
              <div className="flex items-center text-muted-foreground mb-2">
                <Clock className="h-4 w-4 mr-2" />
                <span>Ends: {new Date(auction.endTime.seconds * 1000).toLocaleString()}</span>
              </div>
              <p className="text-lg font-bold mb-4">Current Bid: €{auction.currentBid.toLocaleString()}</p>
              <Link href={`/auctions/${auction.id}`}>
                <Button className="w-full">View Auction</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAuctions.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">No auctions found matching your criteria.</p>
      )}
    </div>
  )
}

