"use client"

import { useState, useEffect, useCallback } from "react"
import { collection, query, where, orderBy, limit, getDocs, type DocumentData } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface UseAuctionsOptions {
  status?: "live" | "upcoming" | "closed"
  propertyType?: string
  location?: string
  priceRange?: { min: number; max: number }
  limit?: number
}

export function useAuctions(options: UseAuctionsOptions = {}) {
  const [auctions, setAuctions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchAuctions = useCallback(
    async (isLoadingMore = false) => {
      try {
        setLoading(true)
        setError(null)

        const constraints: any[] = []

        if (options.status) {
          constraints.push(where("status", "==", options.status))
        }

        if (options.propertyType) {
          constraints.push(where("propertyType", "==", options.propertyType))
        }

        if (options.location) {
          constraints.push(where("location", "==", options.location))
        }

        if (options.priceRange) {
          constraints.push(
            where("currentBid", ">=", options.priceRange.min),
            where("currentBid", "<=", options.priceRange.max),
          )
        }

        const q = query(
          collection(db, "auctions"),
          ...constraints,
          orderBy("endTime", "desc"),
          limit(options.limit || 12),
        )

        const snapshot = await getDocs(q)
        const lastVisible = snapshot.docs[snapshot.docs.length - 1]
        const newAuctions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setLastDoc(lastVisible)
        setHasMore(newAuctions.length === (options.limit || 12))

        if (isLoadingMore) {
          setAuctions((prev) => [...prev, ...newAuctions])
        } else {
          setAuctions(newAuctions)
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    },
    [options.status, options.propertyType, options.location, options.priceRange, options.limit],
  )

  const loadMore = async () => {
    if (!lastDoc || !hasMore) return

    try {
      setLoading(true)
      setError(null)

      const constraints: any[] = []

      if (options.status) {
        constraints.push(where("status", "==", options.status))
      }

      if (options.propertyType) {
        constraints.push(where("propertyType", "==", options.propertyType))
      }

      if (options.location) {
        constraints.push(where("location", "==", options.location))
      }

      if (options.priceRange) {
        constraints.push(
          where("currentBid", ">=", options.priceRange.min),
          where("currentBid", "<=", options.priceRange.max),
        )
      }

      const q = query(
        collection(db, "auctions"),
        ...constraints,
        orderBy("endTime", "desc"),
        limit(options.limit || 12),
        where("__name__", ">", lastDoc.id),
      )

      const snapshot = await getDocs(q)
      const lastVisible = snapshot.docs[snapshot.docs.length - 1]
      const newAuctions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setLastDoc(lastVisible)
      setHasMore(newAuctions.length === (options.limit || 12))
      setAuctions((prev) => [...prev, ...newAuctions])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuctions()
  }, [fetchAuctions])

  return {
    auctions,
    loading,
    error,
    hasMore,
    loadMore,
    refresh: () => fetchAuctions(),
  }
}

