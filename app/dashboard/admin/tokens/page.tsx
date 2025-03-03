"use client"

import { useState } from "react"
import { collection, query, where, getDocs, updateDoc, doc, addDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/lib/firebase"
import AdminDashboardLayout from "@/components/admin-dashboard-layout"
import { useToast } from "@/components/ui/use-toast"

export default function DistributeTokensPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [tokenAmount, setTokenAmount] = useState("")
  const { toast } = useToast()

  const searchUsers = async () => {
    const q = query(
      collection(db, "users"),
      where("email", ">=", searchTerm),
      where("email", "<=", searchTerm + "\uf8ff"),
    )
    const querySnapshot = await getDocs(q)
    const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    setUsers(usersData)
  }

  const distributeTokens = async () => {
    const amount = Number.parseInt(tokenAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid token amount",
        variant: "destructive",
      })
      return
    }

    try {
      for (const userId of selectedUsers) {
        const userRef = doc(db, "users", userId)
        await updateDoc(userRef, {
          tokenBalance: (users.find((u) => u.id === userId).tokenBalance || 0) + amount,
        })

        await addDoc(collection(db, "tokenTransactions"), {
          userId,
          amount,
          type: "admin_distribution",
          timestamp: new Date(),
        })
      }

      toast({
        title: "Success",
        description: `Distributed ${amount} tokens to ${selectedUsers.length} users`,
      })

      setSelectedUsers([])
      setTokenAmount("")
      searchUsers() // Refresh the user list
    } catch (error) {
      console.error("Error distributing tokens:", error)
      toast({
        title: "Error",
        description: "Failed to distribute tokens",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminDashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Distribute Tokens</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search by email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={searchUsers}>Search</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Select</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Token Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id])
                          } else {
                            setSelectedUsers(selectedUsers.filter((id) => id !== user.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.tokenBalance || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Distribute Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Token amount"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
              />
              <Button onClick={distributeTokens} disabled={selectedUsers.length === 0 || tokenAmount === ""}>
                Distribute
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}

