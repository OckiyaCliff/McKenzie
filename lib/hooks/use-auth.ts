"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export type UserData = {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  tokenBalance: number
  createdAt?: Date
  updatedAt?: Date
}

export function useAuth() {
  const [user, loading, error] = useAuthState(auth)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userLoading, setUserLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setUserData(null)
        setIsAdmin(false)
        setUserLoading(false)
        return
      }

      try {
        const usersRef = collection(db, "users")
        const userDocRef = doc(usersRef, user.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const data = userDoc.data() as UserData
          setUserData({ ...data, id: userDoc.id })
          setIsAdmin(data.role === "admin")
        } else {
          console.error("No user document found")
          setUserData(null)
          setIsAdmin(false)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setUserData(null)
        setIsAdmin(false)
      } finally {
        setUserLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  return {
    user,
    userData,
    isAdmin,
    loading: loading || userLoading,
    error,
  }
}
