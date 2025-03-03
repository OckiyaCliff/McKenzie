import ImageKit from "imagekit-javascript"

// Define supported file types
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm']

export type MediaFile = {
  file: File
  type: 'image' | 'video'
  folder?: string
}

export type UploadResponse = {
  url: string
  fileId: string
  thumbnailUrl?: string
}

type ImageKitClientOptions = {
  publicKey: string
  urlEndpoint: string
  authenticationEndpoint?: string
}

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
  authenticationEndpoint: "/api/imagekit-auth",
} as ImageKitClientOptions)

type ImageKitAuthResponse = {
  token: string
  expire: number
  signature: string
}

async function getAuthenticationParameters(): Promise<ImageKitAuthResponse> {
  try {
    const response = await fetch('/api/imagekit-auth')
    if (!response.ok) {
      throw new Error('Failed to get authentication parameters')
    }
    return await response.json()
  } catch (error) {
    console.error('Error getting authentication parameters:', error)
    throw error
  }
}

export async function uploadMedia({ file, type, folder = "general" }: MediaFile): Promise<UploadResponse> {
  try {
    // Validate file type
    if (type === 'image' && !SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Unsupported image type. Supported types: ' + SUPPORTED_IMAGE_TYPES.join(', '))
    }
    if (type === 'video' && !SUPPORTED_VIDEO_TYPES.includes(file.type)) {
      throw new Error('Unsupported video type. Supported types: ' + SUPPORTED_VIDEO_TYPES.join(', '))
    }

    // Get authentication parameters
    const authParams = await getAuthenticationParameters()

    // Define video thumbnail transformation
    const options: any = {
      file,
      fileName: `${Date.now()}-${file.name}`,
      folder,
      tags: [type],
      useUniqueFileName: true,
      ...authParams
    }

    // Add video thumbnail transformation if it's a video
    if (type === 'video') {
      options.transformation = [
        {
          format: "jpg",
          addTime: true,
          timeInSeconds: 1
        }
      ]
    }

    // Upload to ImageKit
    const result = await imagekit.upload(options)

    return {
      url: result.url,
      fileId: result.fileId,
      thumbnailUrl: type === 'video' ? result.thumbnailUrl : undefined
    }
  } catch (error) {
    console.error("Error uploading media:", error)
    throw error
  }
}
