"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "John D.",
    role: "Property Investor",
    content: "The tokenized bidding system made the auction process transparent and secure. Highly recommended!",
    rating: 5,
  },
  {
    name: "Sarah M.",
    role: "First-time Buyer",
    content: "Found my dream villa in Kyrenia through McKenzie Auctions. The process was smooth and professional.",
    rating: 5,
  },
  {
    name: "Michael R.",
    role: "Real Estate Developer",
    content: "As a regular investor, I appreciate the efficiency and security of the platform.",
    rating: 4,
  },
]

export function Testimonials() {
  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-12 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                <CardDescription>{testimonial.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="italic">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

