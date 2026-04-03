import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// Simple password check
function isAuthorized(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return false
  const password = authHeader.replace('Bearer ', '')
  return password === process.env.ADMIN_PASSWORD
}

// GET /api/admin — List all trips (for moderation)
export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('trips')
      .select('id, email, first_name, last_name, from_airport, to_airport, travel_date, flight_number, role, notes, status, is_verified, created_at')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 })
    }

    return NextResponse.json({ trips: data })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/admin — Delete a trip (spam removal)
export async function DELETE(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const tripId = searchParams.get('id')

    if (!tripId) {
      return NextResponse.json({ error: 'Trip ID required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('trips')
      .delete()
      .eq('id', tripId)

    if (error) {
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Trip deleted' })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}