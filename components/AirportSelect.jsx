'use client'

import { useState, useRef, useEffect } from 'react'
import airports from '@/data/airports.json'

export default function AirportSelect({ value, onChange, placeholder = 'Select airport', name }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlighted, setHighlighted] = useState(-1)
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Find selected airport object
  const selectedAirport = airports.find(a => a.code === value)

  // Filter airports based on search
  const filtered = search.trim() === ''
    ? airports
    : airports.filter(a =>
        a.code.toLowerCase().includes(search.toLowerCase()) ||
        a.city.toLowerCase().includes(search.toLowerCase()) ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.country.toLowerCase().includes(search.toLowerCase())
      )

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
        setSearch('')
        setHighlighted(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      const items = listRef.current.children
      if (items[highlighted]) {
        items[highlighted].scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlighted])

  function handleKeyDown(e) {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true)
        e.preventDefault()
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(prev => (prev < filtered.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(prev => (prev > 0 ? prev - 1 : filtered.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlighted >= 0 && filtered[highlighted]) {
        selectAirport(filtered[highlighted].code)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSearch('')
      setHighlighted(-1)
    }
  }

  function selectAirport(code) {
    onChange(code)
    setIsOpen(false)
    setSearch('')
    setHighlighted(-1)
  }

  function handleOpen() {
    setIsOpen(true)
    setHighlighted(-1)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  // Group airports by country
  const grouped = {}
  filtered.forEach(airport => {
    if (!grouped[airport.country]) {
      grouped[airport.country] = []
    }
    grouped[airport.country].push(airport)
  })

  // Flat list for keyboard navigation
  let flatIndex = -1

  return (
    <div ref={wrapperRef} className="relative">
      {/* Display button */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-left
                   focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none
                   flex items-center justify-between"
      >
        {selectedAirport ? (
          <span className="text-black">
            <strong>{selectedAirport.code}</strong>
            <span className="text-black/60 ml-2">{selectedAirport.city}, {selectedAirport.country}</span>
          </span>
        ) : (
          <span className="text-black/40">{placeholder}</span>
        )}
        <svg className="w-4 h-4 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Hidden input for form */}
      <input type="hidden" name={name} value={value || ''} />

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#DFD0B8] rounded-lg shadow-lg max-h-72 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-[#DFD0B8]">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setHighlighted(0)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type city, airport code, or country..."
              className="w-full px-3 py-2 border border-[#DFD0B8] rounded-md text-sm
                         focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
            />
          </div>

          {/* Results */}
          <div ref={listRef} className="overflow-y-auto max-h-56">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-black/40 text-center">
                No airports found
              </div>
            ) : (
              Object.entries(grouped).map(([country, countryAirports]) => (
                <div key={country}>
                  <div className="px-3 py-1.5 bg-[#E7EFC7] text-xs font-semibold text-black/60 sticky top-0">
                    {country}
                  </div>
                  {countryAirports.map((airport) => {
                    flatIndex++
                    const index = flatIndex
                    return (
                      <button
                        key={airport.code}
                        type="button"
                        onClick={() => selectAirport(airport.code)}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3
                                    hover:bg-[#E7EFC7]/50 transition
                                    ${index === highlighted ? 'bg-[#E7EFC7]' : ''}
                                    ${airport.code === value ? 'bg-[#E7EFC7]/70' : ''}`}
                      >
                        <span className="font-bold text-black w-10">{airport.code}</span>
                        <span className="text-black/70">{airport.city} — {airport.name}</span>
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}