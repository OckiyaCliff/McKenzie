"use client"

import type React from "react"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useUpload } from "@/lib/hooks/use-upload"
import { Loader2, X } from "lucide-react"
import Image from "next/image"

const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  propertyType: z.string().min(1, "Property type is required"),
  location: z.string().min(1, "Location is required"),
  bedrooms: z.number().min(0, "Number of bedrooms must be 0 or more"),
  bathrooms: z.number().min(0, "Number of bathrooms must be 0 or more"),
  size: z.number().min(1, "Size must be at least 1 square meter"),
  startingPrice: z.number().min(1, "Starting price must be at least 1"),
  reservePrice: z.number().min(0, "Reserve price must be 0 or more"),
  auctionDuration: z.number().min(1, "Auction duration must be at least 1 day"),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface PropertyListingFormProps {
  onSubmit: (data: PropertyFormData & { images: string[] }) => Promise<void>
  isAdmin?: boolean
}

export function PropertyListingForm({ onSubmit, isAdmin = false }: PropertyListingFormProps) {
  const [images, setImages] = useState<File[]>([])
  const { uploadFiles, uploading, progress } = useUpload()
  const { toast } = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      propertyType: "",
      location: "",
      bedrooms: 0,
      bathrooms: 0,
      size: 0,
      startingPrice: 0,
      reservePrice: 0,
      auctionDuration: 7,
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 5) {
      toast({
        title: "Error",
        description: "Maximum 5 images allowed",
        variant: "destructive",
      })
      return
    }
    setImages((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const onFormSubmit = async (data: PropertyFormData) => {
    try {
      const uploadResults = await uploadFiles(images, {
        folder: "properties",
        maxFiles: 5,
      })

      // Extract URLs from upload results
      const imageUrls = uploadResults.map((result) => result.url)

      await onSubmit({ ...data, images: imageUrls })
      toast({
        title: "Success",
        description: "Property listed successfully",
      })
    } catch (error) {
      console.error("Error listing property:", error)
      toast({
        title: "Error",
        description: "Failed to list property",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title">Title</label>
              <Controller name="title" control={control} render={({ field }) => <Input id="title" {...field} />} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="propertyType">Property Type</label>
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
              <label htmlFor="location">Location</label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => <Input id="location" {...field} />}
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="size">Size (m²)</label>
              <Controller
                name="size"
                control={control}
                render={({ field }) => <Input type="number" id="size" {...field} />}
              />
              {errors.size && <p className="text-red-500 text-sm">{errors.size.message}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="bedrooms">Bedrooms</label>
              <Controller
                name="bedrooms"
                control={control}
                render={({ field }) => <Input type="number" id="bedrooms" {...field} />}
              />
              {errors.bedrooms && <p className="text-red-500 text-sm">{errors.bedrooms.message}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="bathrooms">Bathrooms</label>
              <Controller
                name="bathrooms"
                control={control}
                render={({ field }) => <Input type="number" id="bathrooms" {...field} />}
              />
              {errors.bathrooms && <p className="text-red-500 text-sm">{errors.bathrooms.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => <Textarea id="description" {...field} />}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auction Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startingPrice">Starting Price (€)</label>
              <Controller
                name="startingPrice"
                control={control}
                render={({ field }) => <Input type="number" id="startingPrice" {...field} />}
              />
              {errors.startingPrice && <p className="text-red-500 text-sm">{errors.startingPrice.message}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="reservePrice">Reserve Price (€)</label>
              <Controller
                name="reservePrice"
                control={control}
                render={({ field }) => <Input type="number" id="reservePrice" {...field} />}
              />
              {errors.reservePrice && <p className="text-red-500 text-sm">{errors.reservePrice.message}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="auctionDuration">Auction Duration (days)</label>
              <Controller
                name="auctionDuration"
                control={control}
                render={({ field }) => <Input type="number" id="auctionDuration" {...field} />}
              />
              {errors.auctionDuration && <p className="text-red-500 text-sm">{errors.auctionDuration.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input type="file" accept="image/*" multiple onChange={handleImageChange} disabled={images.length >= 5} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={URL.createObjectURL(image) || "/placeholder.svg"}
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
        </CardContent>
      </Card>

      <Button type="submit" disabled={uploading}>
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Listing Property...
          </>
        ) : (
          "List Property"
        )}
      </Button>
    </form>
  )
}
