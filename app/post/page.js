'use client'

import { useState } from 'react'
import AirportSelect from '@/components/AirportSelect'

export default function PostTrip() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    fromAirport: '',
    toAirport: '',
    travelDate: '',
    flightNumber: '',
    role: '',
    notes: '',
    website: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/trips', {
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

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-[#E7EFC7] p-8 rounded-xl">
          <div className="text-5xl mb-4">✉️</div>
          <h1 className="text-2xl font-bold text-black mb-3">Check Your Email!</h1>
          <p className="text-black/70 mb-4">
            We sent a verification link to <strong>{formData.email}</strong>.
            Click it to make your trip visible to others.
          </p>
          <p className="text-sm text-black/50">
            The email also contains a manage link — save it to edit or delete your post later.
          </p>
          <p className="text-sm text-black/50 mt-4">
            Don&apos;t see it? Check your spam folder.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black">Post a Trip</h1>
        <p className="text-[#393E46] mt-2">
          Share your travel plans to find or offer companionship
        </p>
      </div>

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

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-black mb-3">I am... *</label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`cursor-pointer p-4 rounded-lg border-2 text-center transition ${
              formData.role === 'companion'
                ? 'border-[#3B3B1A] bg-white'
                : 'border-[#DFD0B8] bg-white/60 hover:border-[#948979]'
            }`}>
              <input
                type="radio"
                name="role"
                value="companion"
                checked={formData.role === 'companion'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="flex justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <path stroke={formData.role === 'companion' ? '#3B3B1A' : '#948979'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 19v-1.25C13 15.679 11.081 14 8.714 14H7.286C4.919 14 3 15.679 3 17.75V19m12.286-5h1.428C19.081 14 21 15.679 21 17.75V19M15 5.17a3 3 0 110 5.659M11 8a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <span className="font-medium text-black text-sm">Offering to Help</span>
              <p className="text-xs text-black/50 mt-1">I can accompany someone</p>
            </label>

            <label className={`cursor-pointer p-4 rounded-lg border-2 text-center transition ${
              formData.role === 'seeking_companion'
                ? 'border-[#3B3B1A] bg-white'
                : 'border-[#DFD0B8] bg-white/60 hover:border-[#948979]'
            }`}>
              <input
                type="radio"
                name="role"
                value="seeking_companion"
                checked={formData.role === 'seeking_companion'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="flex justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <path stroke={formData.role === 'seeking_companion' ? '#3B3B1A' : '#948979'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14H9.286C6.919 14 5 15.679 5 17.75V19M19 7v5a2 2 0 01-2 2h-2v5M14 8a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <span className="font-medium text-black text-sm">Seeking Companion</span>
              <p className="text-xs text-black/50 mt-1">Need someone to help</p>
            </label>
          </div>
        </div>

        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-black
                         focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-black
                         focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-black
                         placeholder:text-black/30
                         focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+92 300 1234567"
              className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-black
                         placeholder:text-black/30
                         focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
            />
          </div>
        </div>

        <p className="text-xs text-black/50 -mt-3">
          Your email and phone are never shown publicly. Only shared via email when someone connects.
        </p>

        {/* Route */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">From Airport *</label>
            <AirportSelect
              name="fromAirport"
              value={formData.fromAirport}
              onChange={(code) => setFormData({ ...formData, fromAirport: code })}
              placeholder="Departure airport"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">To Airport *</label>
            <AirportSelect
              name="toAirport"
              value={formData.toAirport}
              onChange={(code) => setFormData({ ...formData, toAirport: code })}
              placeholder="Arrival airport"
            />
          </div>
        </div>

        {/* Date & Flight */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Travel Date *</label>
            <input
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              min={minDate}
              required
              className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-black
                         focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Flight Number</label>
            <input
              type="text"
              name="flightNumber"
              value={formData.flightNumber}
              onChange={handleChange}
              placeholder="e.g. PK301, EK612"
              className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-black
                         placeholder:text-black/30 uppercase
                         focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            placeholder="Any helpful details — e.g. 'My mother (age 65) needs wheelchair assistance' or 'Experienced traveler, happy to help'"
            className="w-full px-4 py-2.5 border border-[#DFD0B8] rounded-lg bg-white text-black
                       placeholder:text-black/30 resize-none
                       focus:ring-2 focus:ring-[#8A784E] focus:border-transparent outline-none"
          />
          <p className="text-xs text-black/40 mt-1">{formData.notes.length}/500</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !formData.role}
          className="w-full bg-[#8A784E] text-white py-3 rounded-lg font-medium
                     hover:bg-[#3B3B1A] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Posting...' : 'Post Trip — Verify via Email'}
        </button>

        <p className="text-xs text-center text-black/40">
          You&apos;ll receive an email to verify your post before it goes live.
        </p>
      </form>
    </div>
  )
}