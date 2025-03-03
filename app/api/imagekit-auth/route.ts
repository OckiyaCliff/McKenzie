import { NextResponse } from "next/server"
import ImageKit from "imagekit"

// Initialize ImageKit with your credentials
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
})

// Helper to add CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET() {
  try {
    if (!process.env.IMAGEKIT_PRIVATE_KEY) {
      throw new Error("ImageKit private key not configured")
    }

    // Get authentication parameters with 30 minutes expiry
    const token = Math.random().toString(36).substring(7)
    const expire = Math.floor(Date.now() / 1000) + (30 * 60) // 30 minutes from now
    const signature = imagekit.getAuthenticationParameters(token, expire).signature

    return NextResponse.json(
      {
        token,
        expire,
        signature,
      },
      {
        headers: corsHeaders,
      }
    )
  } catch (error) {
    console.error("Error generating ImageKit authentication parameters:", error)
    return NextResponse.json(
      { error: "Failed to generate authentication parameters" },
      { status: 500, headers: corsHeaders }
    )
  }
}
