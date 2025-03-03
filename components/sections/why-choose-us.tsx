"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Briefcase, Users } from "lucide-react"

export function WhyChooseUs() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-12 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-center">Secure Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">
                Our tokenized system ensures safe and transparent transactions for all parties involved.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-center">Verified Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">
                All our properties are thoroughly vetted and come from trusted sellers in TRNC.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-center">Expert Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">
                Our team of experts is here to guide you through every step of the auction process.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

