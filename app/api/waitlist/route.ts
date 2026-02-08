import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'redis'

const WAITLIST_KEY = 'waitlist:entries'

// Create Redis client
let redisClient: ReturnType<typeof createClient> | null = null

async function getRedisClient() {
  if (!redisClient) {
    const url = process.env.REDIS_URL
    if (!url) {
      throw new Error('REDIS_URL environment variable is not set')
    }
    redisClient = createClient({ url })
    await redisClient.connect()
  }
  return redisClient
}

// Get all entries from Redis
async function getEntries() {
  try {
    const client = await getRedisClient()
    const data = await client.get(WAITLIST_KEY)
    if (!data) return []
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading from Redis:', error)
    return []
  }
}

// Save entries to Redis
async function saveEntries(entries: any[]) {
  try {
    const client = await getRedisClient()
    await client.set(WAITLIST_KEY, JSON.stringify(entries))
  } catch (error) {
    console.error('Error writing to Redis:', error)
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
    const { name, email, school, destination, referrerName } = body

    // Validate input
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      )
    }

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
    let entries
    try {
      entries = await getEntries()
    } catch (error) {
      console.error('Error reading entries:', error)
      return NextResponse.json(
        { error: 'Failed to read waitlist. Please try again.' },
        { status: 500 }
      )
    }

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
      name: name.trim(),
      email: email.toLowerCase(),
      school,
      destination,
      referrerName: referrerName?.trim() || null,
      createdAt: new Date().toISOString(),
    }

    entries.push(newEntry)

    // Save to Redis
    try {
      await saveEntries(entries)
    } catch (error) {
      console.error('Error saving entries:', error)
      return NextResponse.json(
        { error: 'Failed to save to waitlist. Please try again.' },
        { status: 500 }
      )
    }

    // Send welcome email (don't block on email errors)
    try {
      const { sendWelcomeEmail } = await import('@/lib/email')
      await sendWelcomeEmail(email, school, destination)
      console.log(`Welcome email sent to ${email}`)
    } catch (emailError) {
      // Log error but don't fail the request
      console.error('Failed to send welcome email:', emailError)
    }

    return NextResponse.json(
      { message: 'Successfully added to waitlist', entry: newEntry },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding to waitlist:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Provide more specific error messages
    if (errorMessage.includes('REDIS_URL')) {
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }
    
    if (errorMessage.includes('connect') || errorMessage.includes('Redis')) {
      return NextResponse.json(
        { error: 'Unable to connect to database. Please try again later.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: `Failed to add to waitlist: ${errorMessage}` },
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
