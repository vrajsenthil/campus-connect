import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

const WAITLIST_KEY = 'waitlist:entries'

// Get all entries from KV
async function getEntries() {
  try {
    const entries = await kv.get<any[]>(WAITLIST_KEY)
    return entries || []
  } catch (error) {
    console.error('Error reading from KV:', error)
    return []
  }
}

// Save entries to KV
async function saveEntries(entries: any[]) {
  try {
    await kv.set(WAITLIST_KEY, entries)
  } catch (error) {
    console.error('Error writing to KV:', error)
    throw error
  }
}

// GET - Retrieve all waitlist entries
export async function GET() {
  try {
    const entries = await getEntries()
    return NextResponse.json({ entries }, { status: 200 })
  } catch (error) {
    console.error('Error reading waitlist:', error)
    return NextResponse.json(
      { error: 'Failed to read waitlist entries' },
      { status: 500 }
    )
  }
}

// POST - Add a new waitlist entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, school, destination } = body

    // Validate input
    if (!email || !school || !destination) {
      return NextResponse.json(
        { error: 'Email, school, and destination are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Read existing entries
    const entries = await getEntries()

    // Check if email already exists
    const existingEntry = entries.find((entry: any) => entry.email.toLowerCase() === email.toLowerCase())
    if (existingEntry) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist' },
        { status: 409 }
      )
    }

    // Add new entry
    const newEntry = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      school,
      destination,
      createdAt: new Date().toISOString(),
    }

    entries.push(newEntry)

    // Save to KV
    await saveEntries(entries)

    return NextResponse.json(
      { message: 'Successfully added to waitlist', entry: newEntry },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding to waitlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to waitlist' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a specific entry or clear all entries
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const clearAll = searchParams.get('clearAll') === 'true'

    // Read existing entries
    let entries = await getEntries()

    if (clearAll) {
      // Clear all entries
      entries = []
      await saveEntries(entries)
      return NextResponse.json(
        { message: 'All entries cleared successfully' },
        { status: 200 }
      )
    } else if (id) {
      // Delete specific entry
      const initialLength = entries.length
      entries = entries.filter((entry: any) => entry.id !== id)
      
      if (entries.length === initialLength) {
        return NextResponse.json(
          { error: 'Entry not found' },
          { status: 404 }
        )
      }

      await saveEntries(entries)
      return NextResponse.json(
        { message: 'Entry deleted successfully' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Either id or clearAll parameter is required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error deleting from waitlist:', error)
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    )
  }
}