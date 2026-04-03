import { supabaseAdmin } from '@/lib/supabase'
import { generateToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/resend'
import { NextResponse } from 'next/server'

// GET /api/trips — Search trips
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const date = searchParams.get('date')
    const role = searchParams.get('role')

    // Start query — only show verified, active, future trips
    let query = supabaseAdmin
      .from('trips')
      .select('id, first_name, from_airport, to_airport, travel_date, flight_number, role, notes, created_at')
      .eq('is_verified', true)
      .eq('status', 'active')
      .gte('travel_date', new Date().toISOString().split('T')[0])
      .order('travel_date', { ascending: true })

    // Apply filters
    if (from) query = query.eq('from_airport', from.toUpperCase())
    if (to) query = query.eq('to_airport', to.toUpperCase())
    if (date) query = query.eq('travel_date', date)
    if (role) query = query.eq('role', role)

    const { data, error } = await query.limit(50)

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }

    return NextResponse.json({ trips: data })
  } catch (err) {
    console.error('Search error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST /api/trips — Create a new trip
export async function POST(request) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, phone, fromAirport, toAirport, travelDate, flightNumber, role, notes } = body

    // --- Validation ---
    const errors = []

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Valid email is required')
    }
    if (!firstName || firstName.trim().length < 1) {
      errors.push('First name is required')
    }
    if (!lastName || lastName.trim().length < 1) {
      errors.push('Last name is required')
    }
    if (!fromAirport || !/^[A-Z]{3}$/.test(fromAirport.toUpperCase())) {
      errors.push('Valid departure airport code is required')
    }
    if (!toAirport || !/^[A-Z]{3}$/.test(toAirport.toUpperCase())) {
      errors.push('Valid arrival airport code is required')
    }
    if (fromAirport && toAirport && fromAirport.toUpperCase() === toAirport.toUpperCase()) {
      errors.push('Departure and arrival airports must be different')
    }
    if (!travelDate) {
      errors.push('Travel date is required')
    } else {
      const tripDate = new Date(travelDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (tripDate < today) {
        errors.push('Travel date must be in the future')
      }
    }
    if (!role || !['companion', 'seeking_companion'].includes(role)) {
      errors.push('Role must be companion or seeking_companion')
    }
    if (notes && notes.length > 500) {
      errors.push('Notes must be 500 characters or less')
    }

    // Honeypot check
    if (body.website) {
      // Bots fill hidden fields — silently reject
      return NextResponse.json({ message: 'Trip posted! Check your email.' }, { status: 201 })
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join('. ') }, { status: 400 })
    }

    // --- Rate limiting: max 5 posts per email per day ---
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count } = await supabaseAdmin
      .from('trips')
      .select('*', { count: 'exact', head: true })
      .eq('email', email.toLowerCase())
      .gte('created_at', oneDayAgo)

    if (count >= 5) {
      return NextResponse.json(
        { error: 'Too many posts. Please try again tomorrow.' },
        { status: 429 }
      )
    }

    // --- Generate tokens ---
    const verifyToken = generateToken()
    const manageToken = generateToken()

    // --- Calculate expiry (travel date + 1 day) ---
    const expiresAt = new Date(travelDate)
    expiresAt.setDate(expiresAt.getDate() + 1)

    // --- Insert trip ---
    const { data, error } = await supabaseAdmin
      .from('trips')
      .insert({
        email: email.toLowerCase().trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone ? phone.trim() : null,
        from_airport: fromAirport.toUpperCase(),
        to_airport: toAirport.toUpperCase(),
        travel_date: travelDate,
        flight_number: flightNumber ? flightNumber.toUpperCase().trim() : null,
        role,
        notes: notes ? notes.trim() : null,
        verify_token: verifyToken,
        manage_token: manageToken,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 })
    }

    // --- Send verification email ---
    try {
      await sendVerificationEmail({
        to: email.toLowerCase().trim(),
        firstName: firstName.trim(),
        verifyToken,
        manageToken,
      })
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Trip is created but email failed — not ideal but don't block
    }

    return NextResponse.json(
      { message: 'Trip posted! Check your email to verify.' },
      { status: 201 }
    )
  } catch (err) {
    console.error('Create trip error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}