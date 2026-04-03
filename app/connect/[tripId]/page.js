'use client'

import { useState, useEffect, use } from 'react'
import airports from '@/data/airports.json'
import Link from 'next/link'

function getAirportLabel(code) {
  const airport = airports.find(a => a.code === code)
  return airport ? `${code} — ${airport.city}, ${airport.country}` : code
}

export default function ConnectPage({ params }) {
  const { tripId } = use(params)
  const [trip, setTrip] = useState(null)
  const [loadingTrip, setLoadingTrip] = useState(true)
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    message: '',
    website: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Load trip details
  useEffect(() => {
    async function loadTrip() {
      try {
        const res = await fetch(`/api/trips?id=${tripId}`)
        const data = await res.json()
        const found = data.trips?.find(t => t.id === tripId)
        setTrip(found || null)
      } catch (err) {
        console.error('Failed to load trip:', err)
      } finally {
        setLoadingTrip(false)
      }
    }
    loadTrip()
  }, [tripId])

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/connect/${tripId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loadingTrip) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-[#393E46]">Loading trip details...</p>
      </div>
    )
  }

  // Trip not found
  if (!trip) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-[#E7EFC7] p-8 rounded-xl">
          <div className="text-4xl mb-3">😕</div>
          <h1 className="text-xl font-bold text-black mb-2">Trip Not Found</h1>
          <p className="text-black/70 mb-4">This trip may have been removed or expired.</p>
          <Link
            href="/search"
            className="inline-block bg-[#3B3B1A] text-white px-6 py-2 rounded-lg text-sm
                       hover:bg-[#222831] transition"
          >
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  // Success screen
  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-[#E7EFC7] p-8 rounded-xl">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-black mb-3">Connection Request Sent!</h1>
          <p className="text-black/70 mb-4">
            <strong>{trip.first_name}</strong> will receive an email with your contact details.
            If they&apos;re interested, they&apos;ll reach out to you directly.
          </p>
          <p className="text-sm text-black/50 mb-6">
            Please be patient — they may take some time to respond.
          </p>
          <Link
            href="/search"
            className="inline-block bg-[#3B3B1A] text-white px-6 py-2 rounded-lg text-sm
                       hover:bg-[#222831] transition"
          >
            Search More Trips
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black">Connect with {trip.first_name}</h1>
        <p className="text-[#393E46] mt-2">
          Send your details — they&apos;ll receive them via email
        </p>
      </div>

      {/* Trip Summary */}
      <div className="bg-[#E7EFC7] p-5 rounded-xl mb-6">
        <h2 className="text-sm font-medium text-black/50 mb-2 uppercase tracking-wide">Trip Details</h2>
        <div className="flex items-center space-x-2 text-lg font-semibold text-black mb-2">
          <span>{trip.from_airport}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          <span>{trip.to_airport}</span>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ml-2 ${
            trip.role === 'companion'
              ? 'bg-[#3B3B1A] text-white'
              : 'bg-[#8A784E] text-white'
          }`}>
            {trip.role === 'companion' ? 'Companion' : 'Seeking Help'}
          </span>
        </div>
        <p className="text-sm text-black/70">
          {getAirportLabel(trip.from_airport)} → {getAirportLabel(trip.to_airport)}
        </p>
        <p className="text-sm text-black/70 mt-1">
          {new Date(trip.travel_date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {trip.flight_number && ` • Flight ${trip.flight_number}`}
        </p>
        {trip.notes && (
          <p className="text-sm text-black/60 mt-2 italic">&ldquo;{trip.notes}&rdquo;</p>
        )}
        <p className="text-sm text-black/70 mt-2">Posted by <strong className="text-black">{trip.first_name}</strong></p>
      </div>

      {/* Connect Form */}
      <form onSubmit={handleSubmit} className="bg-[#AEC8A4] p-6 md:p-8 rounded-xl shadow-sm space-y-6">

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Your Name *</label>
          <input
            type="text"
            name="senderName"
            value={formData.senderName}
            onChange={handleChange}
            required
            placeholder="Your full name"
            className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-black
                       placeholder:text-black/30
                       focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Your Email *</label>
            <input
              type="email"
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-black
                         placeholder:text-black/30
                         focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Your Phone</label>
            <input
              type="tel"
              name="senderPhone"
              value={formData.senderPhone}
              onChange={handleChange}
              placeholder="+92 300 1234567"
              className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-black
                         placeholder:text-black/30
                         focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            maxLength={1000}
            placeholder="Introduce yourself — e.g. 'My mother Fatima (age 68) is traveling alone for the first time. She speaks Urdu and basic English. Would really appreciate your help at the airport...'"
            className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-black
                       placeholder:text-black/30 resize-none
                       focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
          />
          <p className="text-xs text-black/40 mt-1">{formData.message.length}/1000</p>
        </div>

        <div className="bg-white/50 p-4 rounded-lg">
          <p className="text-xs text-black/60">
            <strong>What happens next?</strong> {trip.first_name} will receive an email with your
            name, email{formData.senderPhone ? ', phone number' : ''} and message.
            They&apos;ll decide whether to contact you. Your information is sent only to this traveler.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8A784E] text-white py-3 rounded-lg font-medium
                     hover:bg-[#3B3B1A] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Sending...' : 'Send Connection Request'}
        </button>
      </form>
    </div>
  )
}