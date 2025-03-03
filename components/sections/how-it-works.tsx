"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, DollarSign, Home, Building } from "lucide-react"

export function HowItWorks() {
  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardHeader>
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-center">1. Buy Custom Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">
                Purchase tokens securely through bank transfer to participate in our auctions.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Home className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-center">2. Browse Active Auctions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">Explore our wide range of properties currently up for auction in TRNC.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <ArrowRight className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-center">3. Place Your Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">
                Use your tokens to bid on properties. Increase your bid anytime during the auction.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Building className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-center">4. Win & Secure Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">
                If you're the highest bidder when the auction ends, the property is yours to purchase.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

