import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const teamMembers = [
  {
    name: "John McKenzie",
    role: "Founder & CEO",
    image: "/placeholder.svg?height=300&width=300",
    bio: "John has over 20 years of experience in real estate and property auctions.",
  },
  {
    name: "Sarah Thompson",
    role: "Head of Operations",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Sarah ensures smooth running of all auctions and client satisfaction.",
  },
  {
    name: "Michael Chen",
    role: "Chief Technology Officer",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Michael leads our tech team, developing cutting-edge auction platforms.",
  },
  {
    name: "Emily Patel",
    role: "Head of Marketing",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Emily drives our marketing strategies and brand awareness initiatives.",
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">About McKenzie Properties Auction TRNC</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <p className="text-lg mb-6">
            McKenzie Properties Auction TRNC is the leading real estate auction platform in Northern Cyprus. We
            specialize in connecting buyers with unique property opportunities across the region.
          </p>
          <p className="text-lg mb-6">
            Our mission is to make the process of buying and selling properties in TRNC transparent, efficient, and
            accessible to everyone. Whether you're looking for a holiday home, an investment property, or a permanent
            residence, we have something for you.
          </p>
          <p className="text-lg mb-6">
            With years of experience in the TRNC real estate market, our team of experts is dedicated to providing
            exceptional service and guidance throughout the auction process.
          </p>
        </div>
        <div>
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="McKenzie Properties Auction TRNC Office"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member) => (
          <Card key={member.name} className="bg-card text-card-foreground shadow-lg rounded-lg overflow-hidden">
            <Image
              src={member.image || "/placeholder.svg"}
              alt={member.name}
              width={300}
              height={300}
              className="w-full h-64 object-cover"
            />
            <CardHeader>
              <CardTitle>{member.name}</CardTitle>
              <p className="text-primary">{member.role}</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{member.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

