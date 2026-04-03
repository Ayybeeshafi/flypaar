'use client'

import { useState, useEffect, use } from 'react'
import airports from '@/data/airports.json'
import Link from 'next/link'

function getAirportLabel(code) {
  const airport = airports.find(a => a.code === code)
  return airport ? `${code} — ${airport.city}` : code
}

export default function ManagePage({ params }) {
  const { token } = use(params)
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Editable fields
  const [flightNumber, setFlightNumber] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    loadTrip()
  }, [token])

  async function loadTrip() {
    try {
      const res = await fetch(`/api/manage/${token}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Trip not found')
        setLoading(false)
        return
      }

      setTrip(data.trip)
      setFlightNumber(data.trip.flight_number || '')
      setNotes(data.trip.notes || '')
    } catch (err) {
      setError('Failed to load trip')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate() {
    setUpdating(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch(`/api/manage/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flightNumber, notes }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Update failed')
      } else {
        setMessage('Trip updated!')
        setTrip(data.trip)
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setUpdating(false)
    }
  }

  async function handleMarkFound() {
    setUpdating(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch(`/api/manage/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'found' }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Update failed')
      } else {
        setMessage('Marked as companion found!')
        setTrip(data.trip)
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setUpdating(false)
    }
  }

  async function handleReactivate() {
    setUpdating(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch(`/api/manage/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Update failed')
      } else {
        setMessage('Trip reactivated!')
        setTrip(data.trip)
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setUpdating(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    setError('')

    try {
      const res = await fetch(`/api/manage/${token}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Delete failed')
        setDeleting(false)
        return
      }

      setTrip(null)
      setMessage('Trip deleted successfully.')
    } catch (err) {
      setError('Network error')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-[#393E46]">Loading your trip...</p>
      </div>
    )
  }

  if (error && !trip) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-[#E7EFC7] p-8 rounded-xl">
          <div className="text-4xl mb-3">😕</div>
          <h1 className="text-xl font-bold text-black mb-2">
            {message === 'Trip deleted successfully.' ? 'Trip Deleted' : 'Trip Not Found'}
          </h1>
          <p className="text-black/70 mb-4">
            {message || 'This manage link is invalid or the trip has been removed.'}
          </p>
          <Link
            href="/"
            className="inline-block bg-[#3B3B1A] text-white px-6 py-2 rounded-lg text-sm
                       hover:bg-[#222831] transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  // Deleted state
  if (!trip && message) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-[#E7EFC7] p-8 rounded-xl">
          <div className="text-5xl mb-4">🗑️</div>
          <h1 className="text-2xl font-bold text-black mb-3">Trip Deleted</h1>
          <p className="text-black/70 mb-4">Your trip has been permanently removed.</p>
          <Link
            href="/"
            className="inline-block bg-[#3B3B1A] text-white px-6 py-2 rounded-lg text-sm
                       hover:bg-[#222831] transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black">Manage Your Trip</h1>
        <p className="text-[#393E46] mt-2">Edit details, mark as found, or delete</p>
      </div>

      {message && (
        <div className="bg-[#E7EFC7] text-black p-3 rounded-lg text-sm mb-4 text-center font-medium">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 border border-red-200">
          {error}
        </div>
      )}

      {/* Trip Summary */}
      <div className="bg-[#E7EFC7] p-5 rounded-xl mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-lg font-semibold text-black">
            <span>{trip.from_airport}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            <span>{trip.to_airport}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              trip.status === 'active'
                ? 'bg-[#3B3B1A] text-white'
                : trip.status === 'found'
                ? 'bg-[#8A784E] text-white'
                : 'bg-black/20 text-black/60'
            }`}>
              {trip.status === 'active' ? 'Active' : trip.status === 'found' ? 'Companion Found' : 'Expired'}
            </span>
            {!trip.is_verified && (
              <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700">
                Not Verified
              </span>
            )}
          </div>
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
        </p>
        <p className="text-sm text-black/70 mt-1">
          Role: {trip.role === 'companion' ? 'Offering to help' : 'Seeking companion'}
        </p>
      </div>

      {/* Edit Form */}
      <div className="bg-[#AEC8A4] p-6 md:p-8 rounded-xl shadow-sm space-y-6 mb-6">
        <h2 className="font-semibold text-black">Edit Details</h2>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Flight Number</label>
          <input
            type="text"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            placeholder="e.g. PK301, EK612"
            className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-black
                       placeholder:text-black/30 uppercase
                       focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-black
                       placeholder:text-black/30 resize-none
                       focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
          />
          <p className="text-xs text-black/40 mt-1">{notes.length}/500</p>
        </div>

        <button
          onClick={handleUpdate}
          disabled={updating}
          className="w-full bg-[#8A784E] text-white py-2.5 rounded-lg font-medium
                     hover:bg-[#3B3B1A] disabled:opacity-40 transition"
        >
          {updating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {trip.status === 'active' && (
          <button
            onClick={handleMarkFound}
            disabled={updating}
            className="w-full bg-[#E7EFC7] text-black py-2.5 rounded-lg font-medium
                       hover:bg-[#DFD0B8] disabled:opacity-40 transition"
          >
            ✅ Mark as Companion Found
          </button>
        )}

        {trip.status === 'found' && (
          <button
            onClick={handleReactivate}
            disabled={updating}
            className="w-full bg-[#E7EFC7] text-black py-2.5 rounded-lg font-medium
                       hover:bg-[#DFD0B8] disabled:opacity-40 transition"
          >
            🔄 Reactivate Trip
          </button>
        )}

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full bg-white text-red-600 py-2.5 rounded-lg font-medium
                       border border-red-200 hover:bg-red-50 transition"
          >
            🗑️ Delete Trip
          </button>
        ) : (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-700 mb-3">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium
                           hover:bg-red-700 disabled:opacity-40 transition"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-white text-black py-2 rounded-lg font-medium
                           border border-[#DFD0B8] hover:bg-[#E7EFC7] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-center text-black/40 mt-6">
        Bookmark this page to manage your trip later.
      </p>
    </div>
  )
}