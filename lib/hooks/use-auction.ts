"use client"

import { useState, useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function useAuction(auctionId: string) {
  const [auction, setAuction] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const unsubscribe = onSnapshot(
      doc(db, "auctions", auctionId),
      (doc) => {
        if (doc.exists()) {
          setAuction({ id: doc.id, ...doc.data() })
        } else {
          setError(new Error("Auction not found"))
        }
        setLoading(false)
      },
      (err) => {
        setError(err as Error)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [auctionId])

  return { auction, loading, error }
}

