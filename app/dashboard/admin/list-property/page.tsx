"use client"

import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/components/ui/use-toast"
import AdminDashboardLayout from "@/components/admin-dashboard-layout"
import { PropertyListingForm } from "@/components/property-listing-form"

export default function AdminListPropertyPage() {
  const { toast } = useToast()

  const handleSubmit = async (data: any) => {
    try {
      await addDoc(collection(db, "auctions"), {
        ...data,
        status: "pending",
        createdAt: new Date(),
        createdBy: "admin",
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
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-card text-card-foreground rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">List a New Property (Admin)</h1>
        <PropertyListingForm onSubmit={handleSubmit} isAdmin={true} />
      </div>
    </AdminDashboardLayout>
  )
}

