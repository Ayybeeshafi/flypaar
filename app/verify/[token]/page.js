'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'

export default function VerifyPage({ params }) {
  const { token } = use(params)
  const [status, setStatus] = useState('loading') // loading, success, already, error
  const [manageToken, setManageToken] = useState('')

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`/api/trips/verify/${token}`)
        const data = await res.json()

        if (!res.ok) {
          setStatus('error')
          return
        }

        if (data.manageToken) {
          setManageToken(data.manageToken)
        }

        if (data.message.includes('Already')) {
          setStatus('already')
        } else {
          setStatus('success')
        }
      } catch (err) {
        setStatus('error')
      }
    }
    verify()
  }, [token])

  if (status === 'loading') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-[#393E46]">Verifying your trip...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-[#E7EFC7] p-8 rounded-xl">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-black mb-3">Verification Failed</h1>
          <p className="text-black/70 mb-4">
            This link is invalid or has expired. Please try posting your trip again.
          </p>
          <Link
            href="/post"
            className="inline-block bg-[#3B3B1A] text-white px-6 py-2 rounded-lg text-sm
                       hover:bg-[#222831] transition"
          >
            Post a New Trip
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="bg-[#E7EFC7] p-8 rounded-xl">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-black mb-3">
          {status === 'already' ? 'Already Verified!' : 'Trip Verified!'}
        </h1>
        <p className="text-black/70 mb-6">
          {status === 'already'
            ? 'Your trip was already verified and is visible to others.'
            : 'Your trip is now live and visible to other travelers!'
          }
        </p>

        <div className="space-y-3">
          <Link
            href="/search"
            className="block bg-[#3B3B1A] text-white px-6 py-2.5 rounded-lg text-sm font-medium
                       hover:bg-[#222831] transition"
          >
            View All Trips
          </Link>

          {manageToken && (
            <Link
              href={`/manage/${manageToken}`}
              className="block bg-[#8A784E] text-white px-6 py-2.5 rounded-lg text-sm font-medium
                         hover:bg-[#3B3B1A] transition"
            >
              Manage Your Trip
            </Link>
          )}
        </div>

        {manageToken && (
          <div className="mt-6 p-4 bg-white/50 rounded-lg text-left">
            <p className="text-xs text-black/60">
              <strong>Bookmark your manage link:</strong>
            </p>
            <p className="text-xs text-black/40 mt-1 break-all">
              {typeof window !== 'undefined' ? window.location.origin : ''}/manage/{manageToken}
            </p>
            <p className="text-xs text-black/40 mt-1">
              Use this link to edit, mark as found, or delete your trip later.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}