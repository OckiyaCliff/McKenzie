"use client"

import type React from "react"

import { useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { addDoc, collection } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"

const tokenPackages = [
  { amount: 100, price: 50 },
  { amount: 500, price: 225 },
  { amount: 1000, price: 400 },
  { amount: 5000, price: 1750 },
]

export default function BuyTokensPage() {
  const [user] = useAuthState(auth)
  const [selectedPackage, setSelectedPackage] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const { toast } = useToast()

  const handlePackageSelect = (value: string) => {
    setSelectedPackage(value)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    setSelectedPackage("")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const tokenAmount = selectedPackage ? Number.parseInt(selectedPackage) : Number.parseInt(customAmount)
    if (isNaN(tokenAmount) || tokenAmount <= 0) {
      toast({
        title: "Error",
        description: "Please select a package or enter a valid custom amount",
        variant: "destructive",
      })
      return
    }

    if (!paymentProof) {
      toast({
        title: "Error",
        description: "Please upload payment proof",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real application, you would upload the payment proof to a storage service
      // and get a URL to store in the database. For this example, we'll just store the file name.
      const purchaseRef = await addDoc(collection(db, "tokenPurchases"), {
        userId: user.uid,
        amount: tokenAmount,
        status: "pending",
        paymentProof: paymentProof.name,
        createdAt: new Date(),
      })

      toast({
        title: "Success",
        description: "Token purchase request submitted. An admin will review your purchase.",
      })

      // Reset form
      setSelectedPackage("")
      setCustomAmount("")
      setPaymentProof(null)
    } catch (error) {
      console.error("Error submitting token purchase request:", error)
      toast({
        title: "Error",
        description: "Failed to submit token purchase request. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Buy Tokens</h1>
        <Card>
          <CardHeader>
            <CardTitle>Purchase Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="package" className="block text-sm font-medium text-gray-700">
                  Select Token Package
                </label>
                <Select onValueChange={handlePackageSelect} value={selectedPackage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token package" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokenPackages.map((pkg) => (
                      <SelectItem key={pkg.amount} value={pkg.amount.toString()}>
                        {pkg.amount} tokens (€{pkg.price})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700">
                  Or Enter Custom Amount
                </label>
                <Input
                  type="number"
                  id="customAmount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter custom token amount"
                />
              </div>
              <div>
                <label htmlFor="paymentProof" className="block text-sm font-medium text-gray-700">
                  Upload Payment Proof
                </label>
                <Input type="file" id="paymentProof" onChange={handleFileChange} accept="image/*,.pdf" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Bank Transfer Details</h3>
                <p>Please transfer the amount to the following bank account:</p>
                <p>Bank Name: Example Bank</p>
                <p>Account Name: McKenzie Auctions</p>
                <p>IBAN: CY00 0000 0000 0000 0000 0000 0000</p>
                <p>SWIFT/BIC: EXAMPLEBANK</p>
                <p>Reference: Your Email Address</p>
              </div>
              <Button type="submit">Submit Purchase Request</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

