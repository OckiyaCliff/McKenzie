import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, DollarSign, Home, Building } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">How It Works</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card>
          <CardHeader>
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-center">1. Buy Custom Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Purchase tokens to participate in our secure auctions. These tokens are used as currency for bidding.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Home className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-center">2. Browse Active Auctions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Explore our wide range of properties currently up for auction. Filter by location, price, and property
              type.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <ArrowRight className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-center">3. Place Your Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Bid on your favorite properties using your tokens. You can increase your bid at any time during the
              auction.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Building className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-center">4. Win & Secure Your Property</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              If you're the highest bidder when the auction ends, congratulations! The property is yours to purchase.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">How do I register for an auction?</h3>
            <p>
              To register, create an account on our platform and verify your identity. Once approved, you can purchase
              tokens and start bidding.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">What happens if I win an auction?</h3>
            <p>
              If you win, you'll be notified immediately. You'll then need to complete the property purchase process,
              including any necessary legal and financial steps.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I get a refund on unused tokens?</h3>
            <p>
              Yes, you can request a refund for any unused tokens in your account. The refund process typically takes
              3-5 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

