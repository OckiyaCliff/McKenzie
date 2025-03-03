"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { doc, collection, onSnapshot, query, where, orderBy, Timestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { db } from "@/lib/firebase"
import { useGlobalContext } from "@/lib/context/GlobalContext"
import { useToast } from "@/components/ui/use-toast"
import { Check, User } from "lucide-react"

interface Bid {
  id: string
  userId: string
  userEmail: string
  amount: number
  timestamp: { seconds: number; nanoseconds: number }
}

interface Auction {
  id: string
  title: string
  description: string
  currentBid: number
  startingPrice: number
  bidIncrement: number
  endTime: Timestamp
  images: string[]
  location: string
  propertyType: string
  size: number
  amenities: string[]
  features: string[]
  status: "live" | "upcoming" | "closed"
  seller: {
    id: string
    name: string
    isVerified: boolean
    profilePicture?: string
  }
}

export default function AuctionPage() {
  const { id } = useParams()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [userBid, setUserBid] = useState<string>("")
  const [bids, setBids] = useState<Bid[]>([])
  const { user } = useGlobalContext()
  const { toast } = useToast()

  // Fetch auction details
  useEffect(() => {
    if (!id) return

    const unsubscribe = onSnapshot(doc(db, "auctions", id as string), (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        console.log("Fetched Auction Data:", data)

        setAuction({
          id: doc.id,
          title: data.title || "Untitled Auction",
          description: data.description || "No description available",
          currentBid: typeof data.currentBid === "number" ? data.currentBid : 0,
          bidIncrement: typeof data.bidIncrement === "number" ? data.bidIncrement : 1,
          endTime: data.endTime instanceof Timestamp ? data.endTime : Timestamp.now(),
          images: data.images || [],
          location: data.location || "Unknown",
          propertyType: data.propertyType || "Not specified",
          size: data.size || 0,
          amenities: data.amenities || [],
          features: data.features || [],
          status: data.status || "upcoming",
          seller: data.seller || { id: "", name: "Unknown", isVerified: false },
        })
      } else {
        toast({
          title: "Error",
          description: "Auction not found",
          variant: "destructive",
        })
      }
    })

    return () => unsubscribe()
  }, [id, toast])

  // Fetch bid history
  useEffect(() => {
    if (!id) return

    const q = query(collection(db, "bids"), where("auctionId", "==", id), orderBy("timestamp", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBids = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Bid)
      console.log("Fetched Bids:", fetchedBids)
      setBids(fetchedBids)
    })

    return () => unsubscribe()
  }, [id])

  // Countdown Timer
  useEffect(() => {
    if (!auction || !auction.endTime) return

    const timer = setInterval(() => {
      const now = new Date()
      const end = new Date(auction.endTime.seconds * 1000)
      const diff = end.getTime() - now.getTime()

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft("Auction ended")
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [auction])

  if (!auction) {
    return <div className="text-center text-gray-500 py-12">Loading auction details...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Carousel */}
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {auction.images?.length > 0 ? (
                auction.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${auction.title} Image ${index + 1}`}
                      width={800}
                      height={600}
                      className="rounded-lg shadow-lg w-full h-auto"
                    />
                  </CarouselItem>
                ))
              ) : (
                <p className="text-gray-500">No images available</p>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Auction Details */}
        <div>
          <h1 className="text-4xl font-bold">{auction.title}</h1>
          <p className="text-lg mt-4">{auction.description}</p>

          <div className="mt-6 flex items-center">
            <User className="w-6 h-6 mr-2" />
            <span className="font-semibold mr-2">Seller:</span>
            <span>{auction.seller.name}</span>
            {auction.seller.isVerified && (
              <Badge className="ml-2 bg-blue-500">
                <Check className="w-4 h-4 mr-1" /> Verified
              </Badge>
            )}
          </div>

          <Card className="mt-6">
            <CardContent>
              <p>Current Bid: €{auction.currentBid ? auction.currentBid.toLocaleString() : "N/A"}</p>
              <p>Minimum Increment: €{auction.bidIncrement ? auction.bidIncrement.toLocaleString() : "N/A"}</p>
              <p>Time Remaining: {timeLeft}</p>
            </CardContent>
          </Card>

          {/* Bid Input */}
          <Input
            type="number"
            value={userBid}
            onChange={(e) => setUserBid(e.target.value)}
            placeholder="Enter your bid"
            className="mt-4"
          />
          <Button className="mt-2 w-full">Place Bid</Button>
        </div>
      </div>
    </div>
  )
}

