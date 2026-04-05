'use client'

import { useState } from 'react'
import AirportSelect from '@/components/AirportSelect'
import airports from '@/data/airports.json'
import Link from 'next/link'

function getAirportCity(code) {
  const airport = airports.find(a => a.code === code)
  return airport ? airport.city : code
}

export default function SearchContent() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [role, setRole] = useState('')
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    setError('')

    if (!from || !to) {
      setError('Please select both departure and arrival airports.')
      return
    }

    if (from === to) {
      setError('Departure and arrival airports must be different.')
      return
    }

    setLoading(true)
    setSearched(true)

    const params = new URLSearchParams()
    params.append('from', from)
    params.append('to', to)
    if (date) params.append('date', date)
    if (role) params.append('role', role)

    try {
      const res = await fetch(`/api/trips?${params.toString()}`)
      const data = await res.json()
      setTrips(data.trips || [])
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setLoading(false)
    }
  }

  function clearFilters() {
    setFrom('')
    setTo('')
    setDate('')
    setRole('')
    setTrips([])
    setSearched(false)
    setError('')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black">Find Travel Companions</h1>
        <p className="text-[#393E46] mt-2">
          Search for travelers on your route
        </p>
      </div>

      <form onSubmit={handleSearch} className="bg-[#AEC8A4] p-6 rounded-xl shadow-sm mb-8">

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200 mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">From *</label>
            <AirportSelect
              name="from"
              value={from}
              onChange={setFrom}
              placeholder="Departure airport"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">To *</label>
            <AirportSelect
              name="to"
              value={to}
              onChange={setTo}
              placeholder="Arrival airport"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Travel Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-black
                         focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Looking for</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-black
                         focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
            >
              <option value="">All</option>
              <option value="companion">Companions (offering help)</option>
              <option value="seeking_companion">Seeking Companion (need help)</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#3B3B1A] text-white py-2.5 rounded-lg font-medium
                         hover:bg-[#222831] disabled:opacity-40 transition"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2.5 border border-[#3B3B1A] text-[#3B3B1A] rounded-lg
                         hover:bg-white transition text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      {searched && (
        <div>
          <p className="text-sm text-[#393E46] mb-4">
            {trips.length} trip{trips.length !== 1 ? 's' : ''} found
            {' '}for <strong>{getAirportCity(from)}</strong> → <strong>{getAirportCity(to)}</strong>
            {date && ` on ${new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
          </p>

          {trips.length === 0 ? (
            <div className="bg-[#E7EFC7] p-12 rounded-xl text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-black/70 mb-2">No trips found for this route.</p>
              <p className="text-sm text-black/50 mb-4">
                Try removing the date filter or check back later.
              </p>
              <Link
                href="/post"
                className="inline-block bg-[#3B3B1A] text-white px-6 py-2 rounded-lg text-sm
                           hover:bg-[#222831] transition"
              >
                Post your own trip for this route
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {trips.map((trip) => (
                <div key={trip.id} className="bg-[#E7EFC7] p-5 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-lg font-semibold text-black">
                      <span>{trip.from_airport}</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                      <span>{trip.to_airport}</span>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      trip.role === 'companion'
                        ? 'bg-[#3B3B1A] text-white'
                        : 'bg-[#8A784E] text-white'
                    }`}>
                      {trip.role === 'companion' ? 'Companion' : 'Seeking Help'}
                    </span>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <p className="text-sm text-black/70">
                      <span className="font-medium text-black">Route:</span>{' '}
                      {getAirportCity(trip.from_airport)} → {getAirportCity(trip.to_airport)}
                    </p>
                    <p className="text-sm text-black/70">
                      <span className="font-medium text-black">Date:</span>{' '}
                      {new Date(trip.travel_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {trip.flight_number && (
                      <p className="text-sm text-black/70">
                        <span className="font-medium text-black">Flight:</span> {trip.flight_number}
                      </p>
                    )}
                  </div>

                  {trip.notes && (
                    <p className="text-sm text-black/60 mb-3 italic">&ldquo;{trip.notes}&rdquo;</p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-black/10">
                    <span className="text-sm text-black/70">
                      Posted by <strong className="text-black">{trip.first_name}</strong>
                    </span>
                    <Link
                      href={`/connect/${trip.id}`}
                      className="bg-[#3B3B1A] text-white px-4 py-2 rounded-lg text-sm font-medium
                                 hover:bg-[#222831] transition"
                    >
                      Connect
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!searched && (
        <div className="bg-[#E7EFC7] p-12 rounded-xl text-center">
          <div className="text-4xl mb-3"></div>
          <p className="text-black/70">Select departure and arrival airports to find companions on your route.</p>
        </div>
      )}
    </div>
  )
}