"use client"
import { useAuthState } from "react-firebase-hooks/auth"
import { addDoc, collection } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  amount: z.string().nonempty("Please select a token amount"),
  receipt: z.instanceof(File).refine((file) => file.size <= 5000000, "File size should be less than 5MB"),
})

type FormData = z.infer<typeof formSchema>

const tokenTiers = [
  { amount: 100, price: 50 },
  { amount: 500, price: 225 },
  { amount: 1000, price: 400 },
  { amount: 5000, price: 1750 },
]

export default function BuyTokensPage() {
  const [user] = useAuthState(auth)
  const { toast } = useToast()
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    if (!user) return

    try {
      // Create a new token purchase request
      const purchaseRef = await addDoc(collection(db, "tokenPurchases"), {
        userId: user.uid,
        amount: Number(data.amount),
        status: "pending",
        createdAt: new Date(),
      })

      // Upload receipt (implement your file upload logic here)
      // For this example, we'll just update the document with a placeholder receipt URL
      // await updateDoc(purchaseRef, {
      //   receiptUrl: "https://example.com/receipt.jpg",
      // })

      toast({
        title: "Token purchase request submitted",
        description: "An admin will review your purchase and credit your account.",
      })

      // Reset form
      setValue("amount", "")
      setValue("receipt", undefined)
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Buy Tokens</h1>
      <Card>
        <CardHeader>
          <CardTitle>Purchase Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Token Amount
              </label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select token amount" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokenTiers.map((tier) => (
                        <SelectItem key={tier.amount} value={tier.amount.toString()}>
                          {tier.amount} tokens (€{tier.price})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
            </div>
            <div>
              <label htmlFor="receipt" className="block text-sm font-medium text-gray-700">
                Upload Receipt
              </label>
              <Controller
                name="receipt"
                control={control}
                render={({ field }) => (
                  <Input
                    type="file"
                    id="receipt"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                    accept="image/*,.pdf"
                  />
                )}
              />
              {errors.receipt && <p className="text-red-500 text-sm mt-1">{errors.receipt.message}</p>}
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
  )
}

