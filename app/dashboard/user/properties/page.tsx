"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Loader2, Edit, Trash2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"

interface Property {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  status: "pending" | "approved" | "rejected" | "auctioned"
}

export default function UserPropertiesPage() {
  const [user] = useAuthState(auth)
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProperties = async () => {
      if (user) {
        try {
          const q = query(collection(db, "properties"), where("userId", "==", user.uid))
          const querySnapshot = await getDocs(q)
          const fetchedProperties: Property[] = []
          querySnapshot.forEach((doc) => {
            fetchedProperties.push({ id: doc.id, ...doc.data() } as Property)
          })
          setProperties(fetchedProperties)
        } catch (error) {
          console.error("Error fetching properties:", error)
          toast({
            title: "Error",
            description: "Failed to fetch properties. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchProperties()
  }, [user, toast])

  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteDoc(doc(db, "properties", propertyId))
        setProperties(properties.filter((property) => property.id !== propertyId))
        toast({
          title: "Success",
          description: "Property deleted successfully",
        })
      } catch (error) {
        console.error("Error deleting property:", error)
        toast({
          title: "Error",
          description: "Failed to delete property. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpdateProperty = async (propertyId: string, updatedData: Partial<Property>) => {
    try {
      await updateDoc(doc(db, "properties", propertyId), updatedData)
      setProperties(
        properties.map((property) => (property.id === propertyId ? { ...property, ...updatedData } : property)),
      )
      toast({
        title: "Success",
        description: "Property updated successfully",
      })
    } catch (error) {
      console.error("Error updating property:", error)
      toast({
        title: "Error",
        description: "Failed to update property. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Properties</h1>
          <Link href="/dashboard/user/list-property">
            <Button>List New Property</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id}>
              <Image
                src={property.images[0] || "/placeholder.svg"}
                alt={property.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle>{property.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{property.description}</p>
                <p className="font-semibold mb-2">Price: €{property.price.toFixed(2)}</p>
                <p className="mb-4">Status: {property.status}</p>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleUpdateProperty(property.id, { title: prompt("Enter new title") || property.title })
                    }
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeleteProperty(property.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {properties.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">You haven't listed any properties yet.</p>
        )}
      </div>
    </DashboardLayout>
  )
}

