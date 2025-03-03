import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative bg-[url('https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center py-20 md:py-32">
      <div className="absolute inset-0 bg-black/60" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Unique Properties in Northern Cyprus
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8">
            Join our exclusive property auctions and find your dream home or investment opportunity
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auctions">
              <Button size="lg" className="w-full sm:w-auto">
                View Auctions
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

