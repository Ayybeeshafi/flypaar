import { supabaseAdmin } from '@/lib/supabase'
import { sendConnectionEmail } from '@/lib/resend'
import { NextResponse } from 'next/server'

// POST /api/connect/:tripId — Send connection request
export async function POST(request, { params }) {
  try {
    const { tripId } = await params
    const body = await request.json()
    const { senderName, senderEmail, senderPhone, message } = body

    // --- Validation ---
    const errors = []

    if (!senderName || senderName.trim().length < 1) {
      errors.push('Your name is required')
    }
    if (!senderEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      errors.push('Valid email is required')
    }
    if (message && message.length > 1000) {
      errors.push('Message must be 1000 characters or less')
    }

    // Honeypot
    if (body.website) {
      return NextResponse.json({ message: 'Connection request sent!' }, { status: 200 })
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join('. ') }, { status: 400 })
    }

    // --- Find the trip ---
    const { data: trip, error: tripError } = await supabaseAdmin
      .from('trips')
      .select('id, email, first_name, from_airport, to_airport, travel_date, flight_number, status, is_verified')
      .eq('id', tripId)
      .single()

    if (tripError || !trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    if (!trip.is_verified || trip.status !== 'active') {
      return NextResponse.json({ error: 'This trip is no longer active' }, { status: 400 })
    }

    // --- Rate limit: max 3 connection requests per email per trip ---
    const { count } = await supabaseAdmin
      .from('connect_requests')
      .select('*', { count: 'exact', head: true })
      .eq('trip_id', tripId)
      .eq('sender_email', senderEmail.toLowerCase())

    if (count >= 3) {
      return NextResponse.json(
        { error: 'You have already sent requests for this trip' },
        { status: 429 }
      )
    }

    // --- Get IP for rate limiting ---
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    // Rate limit: max 10 connection requests per IP per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count: ipCount } = await supabaseAdmin
      .from('connect_requests')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', oneHourAgo)

    if (ipCount >= 10) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // --- Log the connection request ---
    await supabaseAdmin
      .from('connect_requests')
      .insert({
        trip_id: tripId,
        sender_name: senderName.trim(),
        sender_email: senderEmail.toLowerCase().trim(),
        sender_phone: senderPhone ? senderPhone.trim() : null,
        message: message ? message.trim() : null,
        ip_address: ip,
      })

    // --- Send email to trip poster ---
    try {
      await sendConnectionEmail({
        to: trip.email,
        posterFirstName: trip.first_name,
        senderName: senderName.trim(),
        senderEmail: senderEmail.toLowerCase().trim(),
        senderPhone: senderPhone ? senderPhone.trim() : null,
        message: message ? message.trim() : null,
        tripFrom: trip.from_airport,
        tripTo: trip.to_airport,
        travelDate: new Date(trip.travel_date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        flightNumber: trip.flight_number,
      })
    } catch (emailError) {
      console.error('Connection email error:', emailError)
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Connection request sent! They will receive your details via email.' })
  } catch (err) {
    console.error('Connect error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}