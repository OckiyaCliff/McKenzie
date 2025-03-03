"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { db } from "@/lib/firebase"
import AdminDashboardLayout from "@/components/admin-dashboard-layout"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil, Trash2, Loader2 } from "lucide-react"

interface Auction {
  id: string
  title: string
  startingPrice: number
  currentBid: number
  startTime: Date
  endTime: Date
  status: "pending" | "active" | "ended" | "sold"
}

export default function ManageAuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true)
      try {
        const auctionsSnapshot = await getDocs(query(collection(db, "auctions"), orderBy("startTime", "desc")))
        const auctionsData = auctionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          startTime: doc.data().startTime.toDate(),
          endTime: doc.data().endTime.toDate(),
        })) as Auction[]
        setAuctions(auctionsData)
      } catch (error) {
        console.error("Error fetching auctions:", error)
        toast({
          title: "Error",
          description: "Failed to fetch auctions. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAuctions()
  }, [toast])

  const handleUpdateAuctionStatus = async (auctionId: string, newStatus: "pending" | "active" | "ended" | "sold") => {
    try {
      await updateDoc(doc(db, "auctions", auctionId), { status: newStatus })
      setAuctions(auctions.map((auction) => (auction.id === auctionId ? { ...auction, status: newStatus } : auction)))
      toast({
        title: "Success",
        description: `Auction status updated to ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating auction status:", error)
      toast({
        title: "Error",
        description: "Failed to update auction status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAuction = async (auctionId: string) => {
    try {
      await deleteDoc(doc(db, "auctions", auctionId))
      setAuctions(auctions.filter((auction) => auction.id !== auctionId))
      toast({
        title: "Success",
        description: "Auction deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting auction:", error)
      toast({
        title: "Error",
        description: "Failed to delete auction",
        variant: "destructive",
      })
    }
  }

  const filteredAuctions = auctions.filter((auction) => auction.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <AdminDashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Manage Auctions</h1>
          <Link href="/dashboard/admin/auctions/create">
            <Button>Create New Auction</Button>
          </Link>
        </div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Auctions</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Auction List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Starting Price</TableHead>
                    <TableHead>Current Bid</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAuctions.map((auction) => (
                    <TableRow key={auction.id}>
                      <TableCell>{auction.title}</TableCell>
                      <TableCell>€{auction.startingPrice.toLocaleString()}</TableCell>
                      <TableCell>€{auction.currentBid.toLocaleString()}</TableCell>
                      <TableCell>{auction.startTime.toLocaleString()}</TableCell>
                      <TableCell>{auction.endTime.toLocaleString()}</TableCell>
                      <TableCell>{auction.status}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent aria-describedby="auction-dialog-description">
                              <DialogHeader>
                                <DialogTitle>Edit Auction</DialogTitle>
                                <DialogDescription>Update auction details or change its status.</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="status" className="text-right">
                                    Status
                                  </Label>
                                  <select
                                    id="status"
                                    className="col-span-3"
                                    value={auction.status}
                                    onChange={(e) => handleUpdateAuctionStatus(auction.id, e.target.value as any)}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="ended">Ended</option>
                                    <option value="sold">Sold</option>
                                  </select>
                                </div>
                              </div>
                              <div id="auction-dialog-description" className="sr-only">
                                Dialog showing detailed information about the selected auction
                              </div>
                              <DialogFooter>
                                <Button type="submit">Save changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteAuction(auction.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}
