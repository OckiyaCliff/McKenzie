"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

interface User {
  uid: string
  email: string | null
  displayName: string | null
  role: "admin" | "user"
}

interface GlobalContextType {
  user: User | null
  loading: boolean
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [authUser, authLoading] = useAuthState(auth)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (authUser) {
        const userDoc = await getDoc(doc(db, "users", authUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
            role: userData.role || "user",
          })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    if (!authLoading) {
      fetchUserData()
    }
  }, [authUser, authLoading])

  return <GlobalContext.Provider value={{ user, loading, setUser }}>{children}</GlobalContext.Provider>
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider")
  }
  return context
}

