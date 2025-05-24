"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

interface SearchBoxProps {
  isSmall: boolean
  onSearch: (query: string) => void
  onFocus: () => void
}

export function SearchBox({ isSmall, onSearch, onFocus }: SearchBoxProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(debounce)
  }, [query, onSearch])

  return (
    <motion.div
      className="my-4 w-full max-w-3xl"
      initial={false}
      animate={{
        width: isSmall ? "auto" : "100%",
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`glass-effect shadow-lg rounded-full ${
          isSmall ? "w-64" : "w-full"
        } flex items-center overflow-hidden transition-shadow duration-300 ${
          isFocused ? "ring-2 ring-primary shadow-xl" : ""
        }`}
        initial={false}
        animate={{
          height: isSmall ? 40 : 60,
        }}
        transition={{ duration: 0.3 }}
      >
        <Search className="ml-4 text-primary" size={isSmall ? 20 : 24} />
        <input
          type="text"
          placeholder="Search for a stock symbol or company name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true)
            onFocus()
          }}
          onBlur={() => setIsFocused(false)}
          className="bg-transparent w-full h-full px-4 focus:outline-none text-lg"
        />
      </motion.div>
    </motion.div>
  )
}
