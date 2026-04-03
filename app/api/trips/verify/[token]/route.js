import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET /api/trips/verify/abc123... — Verify email
export async function GET(request, { params }) {
  try {
    const { token } = await params

    if (!token || token.length < 10) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    // Find trip by verify token
    const { data: trip, error: findError } = await supabaseAdmin
      .from('trips')
      .select('id, is_verified, manage_token')
      .eq('verify_token', token)
      .single()

    if (findError || !trip) {
      return NextResponse.json({ error: 'Invalid or expired verification link' }, { status: 404 })
    }

    if (trip.is_verified) {
      return NextResponse.json({
        message: 'Already verified!',
        manageToken: trip.manage_token,
      })
    }

    // Mark as verified and clear verify token
    const { error: updateError } = await supabaseAdmin
      .from('trips')
      .update({
        is_verified: true,
        verify_token: null,
      })
      .eq('id', trip.id)

    if (updateError) {
      console.error('Verify update error:', updateError)
      return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Trip verified! It is now visible to others.',
      manageToken: trip.manage_token,
    })
  } catch (err) {
    console.error('Verify error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}