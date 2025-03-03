import { z } from "zod"

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})

export const auctionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  startingPrice: z.number().positive("Starting price must be positive"),
  endTime: z.date().min(new Date(), "End time must be in the future"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  location: z.string().min(2, "Location is required"),
  propertyType: z.enum(["villa", "apartment", "house", "land"]),
  size: z.number().positive("Size must be positive"),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
})

export const bidSchema = z.object({
  amount: z.number().positive("Bid amount must be positive"),
  auctionId: z.string().min(1),
})

export type UserInput = z.infer<typeof userSchema>
export type AuctionInput = z.infer<typeof auctionSchema>
export type BidInput = z.infer<typeof bidSchema>
