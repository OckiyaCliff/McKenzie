"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { collection, addDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { db } from "@/lib/firebase"
import { uploadImage } from "@/lib/imagekit"
import AdminDashboardLayout from "@/components/admin-dashboard-layout"
import Image from "next/image"
import { X, Loader2 } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startingPrice: z.number().min(1, "Starting price must be at least 1"),
  bidIncrement: z.number().min(1, "Bid increment must be at least 1"),
  propertyType: z.string().min(1, "Property type is required"),
  location: z.string().min(1, "Location is required"),
  size: z.number().min(1, "Size must be at least 1"),
  amenities: z.string(),
  features: z.string(),
})

type FormData = z.infer<typeof formSchema>

export default function CreateAuctionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startingPrice: 0,
      bidIncrement: 0,
      propertyType: "",
      location: "",
      size: 0,
      amenities: "",
      features: "",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + selectedImages.length > 5) {
      toast({
        title: "Error",
        description: "Maximum 5 images allowed",
        variant: "destructive",
      })
      return
    }
    setSelectedImages((prev) => [...prev, ...files])
    const urls = files.map((file) => URL.createObjectURL(file))
    setImageUrls((prev) => [...prev, ...urls])
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: FormData) => {
    try {
      if (selectedImages.length === 0) {
        toast({
          title: "Error",
          description: "Please upload at least one image",
          variant: "destructive",
        })
        return
      }

      setUploading(true)

      const uploadedUrls = await Promise.all(selectedImages.map(uploadImage))

      const auctionData = {
        ...data,
        images: uploadedUrls,
        status: "upcoming",
        currentBid: data.startingPrice,
        totalBids: 0,
        createdAt: new Date(),
        startTime: new Date(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        amenities: data.amenities.split(",").map((item) => item.trim()),
        features: data.features.split(",").map((item) => item.trim()),
      }

      await addDoc(collection(db, "auctions"), auctionData)

      toast({
        title: "Success",
        description: "Auction created successfully",
      })

      router.push("/dashboard/admin/auctions")
    } catch (error) {
      console.error("Error creating auction:", error)
      toast({
        title: "Error",
        description: "Failed to create auction",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <AdminDashboardLayout>
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Auction</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="images">Property Images (Max 5)</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={selectedImages.length >= 5}
                  />
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          width={200}
                          height={200}
                          className="rounded-lg object-cover w-full h-32"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => <Input id="title" {...field} />}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Controller
                      name="propertyType"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="land">Land</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.propertyType && <p className="text-red-500 text-sm">{errors.propertyType.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startingPrice">Starting Price (€)</Label>
                    <Controller
                      name="startingPrice"
                      control={control}
                      render={({ field }) => <Input type="number" id="startingPrice" {...field} />}
                    />
                    {errors.startingPrice && <p className="text-red-500 text-sm">{errors.startingPrice.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bidIncrement">Bid Increment (€)</Label>
                    <Controller
                      name="bidIncrement"
                      control={control}
                      render={({ field }) => <Input type="number" id="bidIncrement" {...field} />}
                    />
                    {errors.bidIncrement && <p className="text-red-500 text-sm">{errors.bidIncrement.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kyrenia">Kyrenia</SelectItem>
                            <SelectItem value="famagusta">Famagusta</SelectItem>
                            <SelectItem value="nicosia">Nicosia</SelectItem>
                            <SelectItem value="iskele">Iskele</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Size (m²)</Label>
                    <Controller
                      name="size"
                      control={control}
                      render={({ field }) => <Input type="number" id="size" {...field} />}
                    />
                    {errors.size && <p className="text-red-500 text-sm">{errors.size.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => <Textarea id="description" {...field} />}
                  />
                  {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                  <Controller
                    name="amenities"
                    control={control}
                    render={({ field }) => (
                      <Input id="amenities" {...field} placeholder="Pool, Garden, Parking, etc." />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Features (comma-separated)</Label>
                  <Controller
                    name="features"
                    control={control}
                    render={({ field }) => (
                      <Input id="features" {...field} placeholder="Air Conditioning, Central Heating, etc." />
                    )}
                  />
                </div>
              </div>

              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Auction...
                  </>
                ) : (
                  "Create Auction"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}

