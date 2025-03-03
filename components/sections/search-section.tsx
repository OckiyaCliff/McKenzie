"use client"

import SearchFilter from "@/components/search-filter"
import { useSearch } from "@/lib/hooks/use-search"

export function SearchSection() {
  const { search } = useSearch()

  return (
    <section className="py-12 bg-accent">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">Find Your Perfect Property</h2>
        <SearchFilter onSearch={search} />
      </div>
    </section>
  )
}

