"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { auth, db } from "@/lib/firebase"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"
import Image from "next/image"
import { Heart, Clock, MapPin, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface WatchlistItem {
  id: string
  auctionId: string
  auction: {
    title: string
    currentBid: number
    endTime: { seconds: number; nanoseconds: number }
    location: string
    image: string
  }
}

export default function WatchlistPage() {
  const [user] = useAuthState(auth)
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const q = query(collection(db, "watchlist"), where("userId", "==", user.uid))
        const querySnapshot = await getDocs(q)
        const items: WatchlistItem[] = []

        for (const doc of querySnapshot.docs) {
          const auctionDoc = await getDocs(query(collection(db, "auctions"), where("id", "==", doc.data().auctionId)))
          if (!auctionDoc.empty) {
            items.push({
              id: doc.id,
              auctionId: doc.data().auctionId,
              auction: auctionDoc.docs[0].data() as WatchlistItem["auction"],
            })
          }
        }

        setWatchlistItems(items)
      } catch (error) {
        console.error("Error fetching watchlist:", error)
        toast({
          title: "Error",
          description: "Unable to fetch watchlist. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWatchlist()
  }, [user, toast])

  const removeFromWatchlist = async (watchlistId: string) => {
    try {
      await deleteDoc(doc(db, "watchlist", watchlistId))
      setWatchlistItems(watchlistItems.filter((item) => item.id !== watchlistId))
      toast({
        title: "Success",
        description: "Property removed from watchlist",
      })
    } catch (error) {
      console.error("Error removing from watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove property from watchlist",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlistItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative">
                <Image
                  src={item.auction.image || "/placeholder.svg"}
                  alt={item.auction.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeFromWatchlist(item.id)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{item.auction.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{item.auction.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Ends: {new Date(item.auction.endTime.seconds * 1000).toLocaleString()}</span>
                  </div>
                  <p className="text-lg font-bold">Current Bid: €{item.auction.currentBid.toLocaleString()}</p>
                  <Link href={`/auctions/${item.auctionId}`}>
                    <Button className="w-full">View Auction</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          {watchlistItems.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No properties in your watchlist</p>
              <Link href="/auctions">
                <Button className="mt-4">Browse Auctions</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

