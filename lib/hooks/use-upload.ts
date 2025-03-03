"use client"

import { useState } from "react"
import { uploadMedia, MediaFile, UploadResponse } from "@/lib/imagekit"
import { db } from "@/lib/firebase"
import { doc, updateDoc, arrayUnion } from "firebase/firestore"

export type UploadOptions = {
  maxFiles?: number
  folder?: string
  collection?: string
  docId?: string
  field?: string
}

export function useUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const uploadFiles = async (
    files: File[],
    options: UploadOptions = {}
  ): Promise<UploadResponse[]> => {
    const {
      maxFiles = 5,
      folder = "general",
      collection,
      docId,
      field = "mediaUrls"
    } = options

    if (files.length > maxFiles) {
      throw new Error(`Maximum ${maxFiles} files allowed`)
    }

    try {
      setUploading(true)
      setError(null)
      const uploadResults: UploadResponse[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        // Determine if file is image or video
        const type = file.type.startsWith('image/') ? 'image' : 'video'
        
        // Upload to ImageKit
        const result = await uploadMedia({
          file,
          type,
          folder
        })
        
        uploadResults.push(result)
        setProgress(((i + 1) / files.length) * 100)

        // If Firebase document details are provided, update the document
        if (collection && docId) {
          const docRef = doc(db, collection, docId)
          await updateDoc(docRef, {
            [field]: arrayUnion({
              url: result.url,
              type,
              thumbnailUrl: result.thumbnailUrl,
              uploadedAt: new Date().toISOString()
            })
          })
        }
      }

      return uploadResults
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return { uploadFiles, uploading, progress, error }
}
