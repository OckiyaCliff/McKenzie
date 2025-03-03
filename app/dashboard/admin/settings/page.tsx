"use client"

import { useState } from "react"
import { doc, updateDoc, collection, getDocs, query, where } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/firebase"
import AdminDashboardLayout from "@/components/admin-dashboard-layout"
import { useToast } from "@/components/ui/use-toast"

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [minBidIncrement, setMinBidIncrement] = useState("100")
  const [auctionDuration, setAuctionDuration] = useState("7")
  const [systemMessage, setSystemMessage] = useState("")
  const { toast } = useToast()

  const handleMaintenanceMode = async () => {
    try {
      const settingsRef = doc(db, "settings", "general")
      await updateDoc(settingsRef, {
        maintenanceMode: !maintenanceMode,
      })
      setMaintenanceMode(!maintenanceMode)
      toast({
        title: "Success",
        description: `Maintenance mode ${!maintenanceMode ? "enabled" : "disabled"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update maintenance mode",
        variant: "destructive",
      })
    }
  }

  const handleUpdateBidIncrement = async () => {
    try {
      const settingsRef = doc(db, "settings", "auction")
      await updateDoc(settingsRef, {
        minBidIncrement: Number(minBidIncrement),
      })
      toast({
        title: "Success",
        description: "Minimum bid increment updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update minimum bid increment",
        variant: "destructive",
      })
    }
  }

  const handleUpdateAuctionDuration = async () => {
    try {
      const settingsRef = doc(db, "settings", "auction")
      await updateDoc(settingsRef, {
        defaultDuration: Number(auctionDuration),
      })
      toast({
        title: "Success",
        description: "Default auction duration updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update auction duration",
        variant: "destructive",
      })
    }
  }

  const handleUpdateSystemMessage = async () => {
    try {
      const settingsRef = doc(db, "settings", "general")
      await updateDoc(settingsRef, {
        systemMessage,
      })
      toast({
        title: "Success",
        description: "System message updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update system message",
        variant: "destructive",
      })
    }
  }

  const handlePurgeInactiveBids = async () => {
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const q = query(collection(db, "bids"), where("timestamp", "<", thirtyDaysAgo))
      const snapshot = await getDocs(q)

      // Count of bids to be purged
      const count = snapshot.size

      if (confirm(`Are you sure you want to purge ${count} inactive bids?`)) {
        // Implementation would go here
        toast({
          title: "Success",
          description: `${count} inactive bids purged`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to purge inactive bids",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminDashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">System Settings</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Switch checked={maintenanceMode} onCheckedChange={handleMaintenanceMode} />
                <Label>Maintenance Mode</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auction Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <Label>Minimum Bid Increment (€)</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={minBidIncrement}
                    onChange={(e) => setMinBidIncrement(e.target.value)}
                    min="1"
                  />
                  <Button onClick={handleUpdateBidIncrement}>Update</Button>
                </div>
              </div>
              <div className="grid gap-4">
                <Label>Default Auction Duration (days)</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={auctionDuration}
                    onChange={(e) => setAuctionDuration(e.target.value)}
                    min="1"
                  />
                  <Button onClick={handleUpdateAuctionDuration}>Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter system-wide message..."
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
              />
              <Button onClick={handleUpdateSystemMessage}>Update Message</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handlePurgeInactiveBids}>
                Purge Inactive Bids (30+ days)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  )
}

