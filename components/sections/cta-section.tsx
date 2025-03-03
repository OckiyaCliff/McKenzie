"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-semibold mb-6">Ready to Start Bidding?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join our community of property investors and find your next investment opportunity in TRNC.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Create Account
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
          <Link href="/auctions">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Browse Auctions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

