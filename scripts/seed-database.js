import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: "service_account",
  project_id: "mckenzie-f3bab",
  private_key_id: "ff5618abb7fdb92c096eb0883f0aee16c29f3b34",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCV7lds3snLyApa\nDemfH8pAODYqmcRO23gFoAXEVhREqXTDqb+2fRwzmHt445z0rfw3RzonrwKLa/Tw\nyP3zue4FKbIJtluWLd4DNxKvdEP4MkgH8fN4YtDOQkJBFnssXJI4/UmXWbzH117N\nvUSdkyD19otdO3arvCpluzuf9+nDd4tqxNGPQ9lY+wwr5JZRRk2Si+15MF2E0ip/\n1OqHsu+IZ92FJ3t9XVu7oIkEAeH1+EBXjN5OBigB8ceVMv/9HkJUAggwq0QU81x9\nwCcxE08Vn4kUvL67OqDONoa+5BYroXGZGHF2qhob+g/Pf700Ej+RfmF/72yJzAun\nj9DRa3TZAgMBAAECggEAA3UBDs11x3U7uN8agIzn+dJZ/GI6hqt0kWOi0me+NKWY\nH8VXmm540p881Jkh9rnWx5MEviLAyyRwe8dUpLSoLnYLSQJLixNQa9BOpd1HTm8h\nXk6Hw8I6iJD6TFwnd6rEQ9xiQKNE8TIv+Uw4i24Xq9g1Fy+ecUAH1bvrGGmL2jIL\ny3ghKgJ6BQ0OPVx8NMW3vLAS+dxwD2FUgEk2LXDIr7Cq46qlo/QtWYqR/plVFxwK\nimOoMBgoZYjz2ewizBwACCoDz2JuBwgeFUP5I78rjhDsyjlLo35TWw3Ub0cozuHO\nn0FBLWkaU1xVtIqf/zIJz2A1iP1wLMrHA4btPrfBAQKBgQDHrbpMlFHkpTgeDx/7\nU8I8LtN0pPkwng5JD2EFRpatUGWkNvOfRWKI4fwK+RhIRTqyc6Eq0B1XXUMA1ESH\nRsRjrmztaHT0LsolMIqoKa4++gI6pf255cxhWDFaiEpY2vHn6FCz+pG9BEvk2kNh\nblgIMLuElyGsGuk48T4yt0HLAQKBgQDAOHggXo5Awz/tQhskNhcy+E3dMb6cbOSj\npf4eiBQgbQQ43iGuayFVjjR8JoNp+Ao1R4WIoX2UcubT/SNKUN3GI6MLAGprsFlE\nSALhOnY6ZjNix2r+WOC7MXZcoAreqSltg/377UGNyG7GqrlbBO7A9B+mulj1L8SC\nqBkzQ7th2QKBgQCRaKzrSXNdiweTtDX5AuTGiN8J6X1h7ye+AooHmoDtk0eBT1cY\nHCIGRnMR1pXdQzTccSHjmIxVa5/4gZup21n2sTW3qULJ8yzX6kJ+9WNjjxKCfRCJ\nCJROKzg9klR54m8ZD299sTHiMLfH3z4EPKO0yzAy/Q/TUgGWqu89ZYBvAQKBgFJq\nI78lK3LDBC6ysDZnZqz431GeWW5yFdnAeuMWTyLT+wJy4xgIYMNw9DnivWd67M2J\nO8yoCNLULPnpR+8+GsgwUWCPLhG8C5oGEg4FZdmGJjQM8mfZLYm1HF18VQzAlL2a\n4RPZ1sh2jmBppI1M4R0jzkpLDYcakvO+JQfg23+JAoGAZRCqAV2T1PBHJWSGNvcv\nvVE3VS7KFcXHMa95BiCKN1eK+RgfZM2t1byNDDcUBzSHWHakHKK2J/BjErb03vWG\ne/mN8LU/v8fuQYDgubWxCl6oo+t7DhWCZT2kL2W13t95l4CXU72soXTFg32BL1L5\ndtbGUxPZLqfnU1IUnLEaTtk=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@mckenzie-f3bab.iam.gserviceaccount.com",
  client_id: "104848164427461809388",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mckenzie-f3bab.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
}

initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore()

// Helper function to add documents with auto-generated IDs
async function addDocument(collectionName, data) {
  const docRef = await db.collection(collectionName).add(data)
  console.log(`Added document with ID: ${docRef.id} to ${collectionName}`)
  return docRef
}

// Seed Users
async function seedUsers() {
  const users = [
    { name: "John Doe", email: "john@example.com", role: "user", tokenBalance: 1000 },
    { name: "Jane Smith", email: "jane@example.com", role: "user", tokenBalance: 500 },
    { name: "Admin User", email: "admin@example.com", role: "admin", tokenBalance: 10000 },
  ]

  for (const user of users) {
    await addDocument("users", user)
  }
}

// Seed Auctions
async function seedAuctions() {
  const auctions = [
    {
      title: "Luxury Villa in Kyrenia",
      description: "Beautiful 5-bedroom villa with sea view",
      startingPrice: 500000,
      currentBid: 500000,
      status: "active",
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      images: ["https://example.com/villa1.jpg"],
      location: "Kyrenia",
      propertyType: "villa",
      size: 350,
      bedrooms: 5,
      bathrooms: 4,
    },
    {
      title: "Beachfront Apartment in Famagusta",
      description: "Modern 2-bedroom apartment with direct beach access",
      startingPrice: 200000,
      currentBid: 210000,
      status: "active",
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      images: ["https://example.com/apartment1.jpg"],
      location: "Famagusta",
      propertyType: "apartment",
      size: 120,
      bedrooms: 2,
      bathrooms: 2,
    },
  ]

  for (const auction of auctions) {
    await addDocument("auctions", auction)
  }
}

// Seed Bids
async function seedBids() {
  const bids = [
    { userId: "user1Id", auctionId: "auction1Id", amount: 510000, timestamp: new Date() },
    { userId: "user2Id", auctionId: "auction1Id", amount: 520000, timestamp: new Date() },
    { userId: "user1Id", auctionId: "auction2Id", amount: 215000, timestamp: new Date() },
  ]

  for (const bid of bids) {
    await addDocument("bids", bid)
  }
}

// Main function to run all seeding operations
async function seedDatabase() {
  try {
    await seedUsers()
    await seedAuctions()
    await seedBids()
    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

// Run the seeding process
seedDatabase()

