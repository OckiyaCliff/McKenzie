"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useAuctions } from "@/lib/hooks/use-auctions"

export function FeaturedAuctions() {
  const { auctions, loading, error } = useAuctions({ status: "active", limit: 6 })

  if (loading) {
    return <div className="text-center py-16">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">Error loading auctions. Please try again later.</div>
  }

  if (auctions.length === 0) {
    return <div className="text-center py-16">No active auctions available at the moment.</div>
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-0">Featured Property Auctions</h2>
          <Link href="/auctions">
            <Button variant="outline">
              View All
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
        <Carousel className="w-full">
          <CarouselContent>
            {auctions.map((auction) => (
              <CarouselItem key={auction.id} className="md:basis-1/2 lg:basis-1/3 p-2">
                <Card className="h-full flex flex-col">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <Image
                        src={auction.images?.[0] || "/placeholder.svg"}
                        alt={auction.title}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-4 right-4 bg-green-500">Live Auction</Badge>
                      {auction.seller?.isVerified && (
                        <Badge className="absolute top-4 left-4 bg-blue-500">
                          <Check className="w-4 h-4 mr-1" /> Verified Seller
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-grow">
                    <CardTitle className="text-lg mb-2">{auction.title}</CardTitle>
                    <CardDescription>{auction.location || "Location not specified"}</CardDescription>
                    <p className="text-xl font-bold text-primary mt-2">
                      Current Bid: €{auction.currentBid.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ends: {new Date(auction.endDate.seconds * 1000).toLocaleString()}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/auctions/${auction.id}`} className="w-full">
                      <Button className="w-full">View Auction</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}

