"use client"

import { useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function useSearch() {
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const search = async (params: {
    query?: string
    priceRange?: { min: number; max: number }
    propertyType?: string
    location?: string
    status?: "live" | "upcoming" | "closed"
  }) => {
    try {
      setLoading(true)
      setError(null)

      const constraints: any[] = []

      if (params.status) {
        constraints.push(where("status", "==", params.status))
      }

      if (params.propertyType) {
        constraints.push(where("propertyType", "==", params.propertyType))
      }

      if (params.location) {
        constraints.push(where("location", "==", params.location))
      }

      if (params.priceRange) {
        constraints.push(
          where("currentBid", ">=", params.priceRange.min),
          where("currentBid", "<=", params.priceRange.max),
        )
      }

      const q = query(collection(db, "auctions"), ...constraints)
      const snapshot = await getDocs(q)

      let results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Client-side text search if query is provided
      if (params.query) {
        const searchQuery = params.query.toLowerCase()
        results = results.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery) ||
            item.description.toLowerCase().includes(searchQuery) ||
            item.location.toLowerCase().includes(searchQuery),
        )
      }

      setSearchResults(results)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return {
    searchResults,
    loading,
    error,
    search,
  }
}

