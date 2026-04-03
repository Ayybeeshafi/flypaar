import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET /api/manage/abc123... — Get trip details for management
export async function GET(request, { params }) {
  try {
    const { token } = await params

    const { data: trip, error } = await supabaseAdmin
      .from('trips')
      .select('id, first_name, from_airport, to_airport, travel_date, flight_number, role, notes, status, is_verified, created_at')
      .eq('manage_token', token)
      .single()

    if (error || !trip) {
      return NextResponse.json({ error: 'Trip not found. Check your manage link.' }, { status: 404 })
    }

    return NextResponse.json({ trip })
  } catch (err) {
    console.error('Manage GET error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT /api/manage/abc123... — Update trip
export async function PUT(request, { params }) {
  try {
    const { token } = await params
    const body = await request.json()

    // Find trip first
    const { data: trip, error: findError } = await supabaseAdmin
      .from('trips')
      .select('id')
      .eq('manage_token', token)
      .single()

    if (findError || !trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    // Build update object — only allow certain fields
    const updates = {}

    if (body.status && ['active', 'found'].includes(body.status)) {
      updates.status = body.status
    }
    if (body.flightNumber !== undefined) {
      updates.flight_number = body.flightNumber ? body.flightNumber.toUpperCase().trim() : null
    }
    if (body.notes !== undefined) {
      updates.notes = body.notes ? body.notes.trim() : null
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const { data, error: updateError } = await supabaseAdmin
      .from('trips')
      .update(updates)
      .eq('id', trip.id)
      .select('id, first_name, from_airport, to_airport, travel_date, flight_number, role, notes, status, is_verified')
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Trip updated!', trip: data })
  } catch (err) {
    console.error('Manage PUT error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/manage/abc123... — Delete trip
export async function DELETE(request, { params }) {
  try {
    const { token } = await params

    const { error } = await supabaseAdmin
      .from('trips')
      .delete()
      .eq('manage_token', token)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Trip deleted.' })
  } catch (err) {
    console.error('Manage DELETE error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}