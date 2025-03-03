import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedAuctions } from "@/components/sections/featured-auctions"
import { HowItWorks } from "@/components/sections/how-it-works"
import { WhyChooseUs } from "@/components/sections/why-choose-us"
import { Testimonials } from "@/components/sections/testimonials"
import { CTASection } from "@/components/sections/cta-section"
import { SearchSection } from "@/components/sections/search-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <SearchSection />
      <FeaturedAuctions />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
    </div>
  )
}

