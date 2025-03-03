"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchFilterProps {
  onSearch: (query: string, filters: Filters) => void
}

interface Filters {
  priceRange: string
  propertyType: string
  location: string
}

export default function SearchFilter({ onSearch }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Filters>({
    priceRange: "",
    propertyType: "",
    location: "",
  })

  const handleSearch = () => {
    onSearch(searchQuery, filters)
  }

  return (
    <div className="bg-accent p-4 rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Find properties by name/location"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={filters.priceRange} onValueChange={(value) => setFilters({ ...filters, priceRange: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-100000">€0 - €100,000</SelectItem>
              <SelectItem value="100000-500000">€100,000 - €500,000</SelectItem>
              <SelectItem value="500000+">€500,000+</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.propertyType}
            onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kyrenia">Kyrenia</SelectItem>
              <SelectItem value="nicosia">Nicosia</SelectItem>
              <SelectItem value="famagusta">Famagusta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSearch} className="w-full md:w-auto">
          Search
        </Button>
      </div>
    </div>
  )
}

