"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { updatePassword } from "firebase/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { auth, db } from "@/lib/firebase"
import DashboardLayout from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Check, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useUpload } from "@/lib/hooks/use-upload"

interface UserData {
  name: string
  email: string
  isVerified: boolean
  profilePicture?: string
}

export default function AccountSettingsPage() {
  const [user] = useAuthState(auth)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [name, setName] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const { toast } = useToast()
  const { uploadFiles, uploading } = useUpload()

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData
          setUserData(data)
          setName(data.name)
        }
      }
    }

    fetchUserData()
  }, [user])

  const handleUpdateProfile = async () => {
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), { name })
        setUserData((prevData) => ({ ...prevData!, name }))
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } catch (error) {
        console.error("Error updating profile:", error)
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpdatePassword = async () => {
    if (user && newPassword === confirmPassword) {
      try {
        await updatePassword(user, newPassword)
        setNewPassword("")
        setConfirmPassword("")
        toast({
          title: "Success",
          description: "Password updated successfully",
        })
      } catch (error) {
        console.error("Error updating password:", error)
        toast({
          title: "Error",
          description: "Failed to update password",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
    }
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0])
    }
  }

  const handleUploadProfilePicture = async () => {
    if (user && profilePicture) {
      try {
        const [result] = await uploadFiles([profilePicture], {
          folder: "profiles",
          maxFiles: 1
        })
        
        await updateDoc(doc(db, "users", user.uid), { 
          profilePicture: result.url 
        })
        
        setUserData((prevData) => ({ 
          ...prevData!, 
          profilePicture: result.url 
        }))
        
        toast({
          title: "Success",
          description: "Profile picture uploaded successfully",
        })
        
        // Clear the selected file
        setProfilePicture(null)
      } catch (error) {
        console.error("Error uploading profile picture:", error)
        toast({
          title: "Error",
          description: "Failed to upload profile picture",
          variant: "destructive",
        })
      }
    }
  }

  if (!userData) return <div>Loading...</div>

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input type="email" id="email" value={userData.email} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Verification Status</label>
                  {userData.isVerified ? (
                    <Badge className="bg-green-500 text-white">
                      <Check className="w-4 h-4 mr-1" /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not Verified</Badge>
                  )}
                </div>
                <Button onClick={handleUpdateProfile}>Update Profile</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData?.profilePicture && (
                  <img
                    src={userData.profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                )}
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfilePictureChange} 
                  disabled={uploading}
                />
                <Button 
                  onClick={handleUploadProfilePicture} 
                  disabled={!profilePicture || uploading}
                >
                  {uploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" /> Upload Profile Picture
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <Input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleUpdatePassword}>Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
