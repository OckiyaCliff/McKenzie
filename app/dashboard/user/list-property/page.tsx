"use client"

import { addDoc, collection } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import { PropertyListingForm } from "@/components/property-listing-form"

export default function UserListPropertyPage() {
  const [user] = useAuthState(auth)
  const { toast } = useToast()

  const handleSubmit = async (data: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to list a property",
        variant: "destructive",
      })
      return
    }

    try {
      await addDoc(collection(db, "auctions"), {
        ...data,
        userId: user.uid,
        status: "pending",
        createdAt: new Date(),
      })
      toast({
        title: "Success",
        description: "Property listed successfully and is pending approval.",
      })
    } catch (error) {
      console.error("Error listing property:", error)
      toast({
        title: "Error",
        description: "Failed to list property. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-card text-card-foreground rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">List Your Property for Auction</h1>
        <PropertyListingForm onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  )
}

