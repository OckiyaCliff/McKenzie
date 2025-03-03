"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/components/ui/use-toast"

const faqs = [
  {
    question: "How do I participate in an auction?",
    answer:
      "To participate in an auction, you need to first create an account and purchase tokens. Once you have tokens, you can place bids on any active auction. Make sure to verify your account and complete your profile before bidding.",
  },
  {
    question: "How do tokens work?",
    answer:
      "Tokens are our platform's bidding currency. You can purchase tokens using bank transfer. Each token has a fixed value, and you'll need tokens to place bids. Unused tokens can be refunded at any time.",
  },
  {
    question: "What happens if I win an auction?",
    answer:
      "If you win an auction, you'll be notified immediately. You'll then need to complete the property purchase process, which includes paying the full amount and completing necessary legal documentation.",
  },
  {
    question: "How do I verify my account?",
    answer:
      "Account verification requires submitting valid identification documents and proof of address. These documents will be reviewed by our team, and verification typically takes 1-2 business days.",
  },
  {
    question: "What are the bidding rules?",
    answer:
      "Each auction has a minimum bid increment. You must have sufficient tokens to place a bid. Bids are final and cannot be retracted. The auction ends at the specified time, and the highest bidder wins.",
  },
]

export default function HelpCenterPage() {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const { toast } = useToast()

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Implementation would go here
      toast({
        title: "Support ticket submitted",
        description: "We'll get back to you within 24 hours",
      })
      setSubject("")
      setMessage("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit support ticket",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Help Center</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit">Submit Ticket</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Button variant="link" className="p-0">
                      User Guide
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="p-0">
                      Terms of Service
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="p-0">
                      Privacy Policy
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="p-0">
                      Bidding Rules
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p>support@mckenzieauctions.com</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p>+90 533 123 4567</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Office Hours</h3>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

