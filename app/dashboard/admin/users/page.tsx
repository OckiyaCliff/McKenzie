"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { db } from "@/lib/firebase"
import AdminDashboardLayout from "@/components/admin-dashboard-layout"

interface User {
  id: string
  name: string
  email: string
  tokenBalance: number
  isBlocked: boolean
  isVerified: boolean
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [bonusTokens, setBonusTokens] = useState(0)

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"))
      const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as User)
      setUsers(usersData)
    }

    fetchUsers()
  }, [])

  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    await updateDoc(doc(db, "users", userId), { isBlocked: !isBlocked })
    setUsers(users.map((user) => (user.id === userId ? { ...user, isBlocked: !isBlocked } : user)))
  }

  const handleRemoveUser = async (userId: string) => {
    await deleteDoc(doc(db, "users", userId))
    setUsers(users.filter((user) => user.id !== userId))
  }

  const handleEditBalance = async (userId: string, newBalance: number) => {
    await updateDoc(doc(db, "users", userId), { tokenBalance: newBalance })
    setUsers(users.map((user) => (user.id === userId ? { ...user, tokenBalance: newBalance } : user)))
  }

  const handleVerifyUser = async (userId: string, isVerified: boolean) => {
    await updateDoc(doc(db, "users", userId), { isVerified: !isVerified })
    setUsers(users.map((user) => (user.id === userId ? { ...user, isVerified: !isVerified } : user)))
  }

  const handleAssignBonusTokens = async () => {
    for (const userId of selectedUsers) {
      const user = users.find((u) => u.id === userId)
      if (user) {
        await handleEditBalance(userId, user.tokenBalance + bonusTokens)
      }
    }
    setSelectedUsers([])
    setBonusTokens(0)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AdminDashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Assign Bonus Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Number of tokens"
                value={bonusTokens}
                onChange={(e) => setBonusTokens(Number(e.target.value))}
              />
              <Button onClick={handleAssignBonusTokens} disabled={selectedUsers.length === 0 || bonusTokens === 0}>
                Assign to Selected Users
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Select</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Token Balance</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
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
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.tokenBalance}</TableCell>
                    <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant={user.isBlocked ? "destructive" : "default"}
                          onClick={() => handleBlockUser(user.id, user.isBlocked)}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </Button>
                        <Button variant="destructive" onClick={() => handleRemoveUser(user.id)}>
                          Remove
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">Edit Balance</Button>
                          </DialogTrigger>
                          <DialogContent aria-describedby="user-dialog-description">
                            <DialogHeader>
                              <DialogTitle>Edit Token Balance</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="balance" className="text-right">
                                  New Balance
                                </Label>
                                <Input
                                  id="balance"
                                  type="number"
                                  className="col-span-3"
                                  defaultValue={user.tokenBalance}
                                  onChange={(e) => handleEditBalance(user.id, Number(e.target.value))}
                                />
                              </div>
                            </div>
                            <div id="user-dialog-description" className="sr-only">
                              Dialog showing detailed information about the selected user
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant={user.isVerified ? "default" : "outline"}
                          onClick={() => handleVerifyUser(user.id, user.isVerified)}
                        >
                          {user.isVerified ? "Unverify" : "Verify"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}
