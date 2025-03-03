"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, limit, startAfter, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface PaginationOptions {
  collectionName: string
  pageSize?: number
  orderByField?: string
  orderDirection?: "asc" | "desc"
}

export function usePagination<T extends DocumentData = DocumentData>({
  collectionName,
  pageSize = 10,
  orderByField = "createdAt",
  orderDirection = "desc"
}: PaginationOptions) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<T> | null>(null)

  // Function to create the base query
  const createBaseQuery = () => {
    return query(
      collection(db, collectionName),
      orderBy(orderByField, orderDirection),
      limit(pageSize)
    )
  }

  // Function to load initial data
  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)

      const baseQuery = createBaseQuery()
      const snapshot = await getDocs(baseQuery)

      const docs = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as T))

      setItems(docs)
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] as QueryDocumentSnapshot<T> || null)
      setHasMore(snapshot.docs.length === pageSize)
    } catch (err) {
      setError(err as Error)
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Function to load more data
  const loadMore = async () => {
    if (!hasMore || loading || !lastVisible) return

    try {
      setLoading(true)
      setError(null)

      const nextQuery = query(
        collection(db, collectionName),
        orderBy(orderByField, orderDirection),
        startAfter(lastVisible),
        limit(pageSize)
      )

      const snapshot = await getDocs(nextQuery)

      const newDocs = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as T))

      setItems(prev => [...prev, ...newDocs])
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] as QueryDocumentSnapshot<T> || null)
      setHasMore(snapshot.docs.length === pageSize)
    } catch (err) {
      setError(err as Error)
      console.error("Error loading more data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [collectionName, pageSize, orderByField, orderDirection])

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore,
    refresh: loadInitialData
  }
}
