import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'redis'

const BOOKINGS_KEY = 'bookings:entries'

// Create Redis client
let redisClient: ReturnType<typeof createClient> | null = null

async function getRedisClient() {
  if (!redisClient) {
    const url = process.env.REDIS_URL
    if (!url) {
      throw new Error('REDIS_URL environment variable is not set')
    }
    redisClient = createClient({ url })
    
    // Handle connection errors
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })
    
    try {
      await redisClient.connect()
    } catch (error) {
      console.error('Failed to connect to Redis:', error)
      redisClient = null
      throw error
    }
  }
  return redisClient
}

// Get all bookings from Redis
async function getBookings() {
  try {
    const client = await getRedisClient()
    const data = await client.get(BOOKINGS_KEY)
    if (!data) return []
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading from Redis:', error)
    return []
  }
}

// Save bookings to Redis
async function saveBookings(bookings: any[]) {
  try {
    const client = await getRedisClient()
    await client.set(BOOKINGS_KEY, JSON.stringify(bookings))
  } catch (error) {
    console.error('Error writing to Redis:', error)
    throw error
  }
}

// GET - Retrieve all bookings
export async function GET() {
  try {
    const bookings = await getBookings()
    return NextResponse.json({ bookings }, { status: 200 })
  } catch (error) {
    console.error('Error reading bookings:', error)
    // Return empty array instead of error to prevent page crash
    return NextResponse.json({ bookings: [] }, { status: 200 })
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, homeLocation, destination } = body

    // Validate input
    if (!email || !homeLocation || !destination) {
      return NextResponse.json(
        { error: 'Email, home location, and destination are required' },
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

    // Validate that home location and destination are different
    if (homeLocation === destination) {
      return NextResponse.json(
        { error: 'Home location and destination must be different' },
        { status: 400 }
      )
    }

    // Read existing bookings
    const bookings = await getBookings()

    // Create new booking
    const newBooking = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      homeLocation,
      destination,
      createdAt: new Date().toISOString(),
      status: 'pending', // pending, confirmed, cancelled
    }

    bookings.push(newBooking)

    // Save to Redis
    await saveBookings(bookings)

    return NextResponse.json(
      { message: 'Booking created successfully', booking: newBooking },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating booking:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to create booking: ${errorMessage}` },
      { status: 500 }
    )
  }
}

// DELETE - Delete a specific booking or clear all bookings
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const clearAll = searchParams.get('clearAll') === 'true'

    // Read existing bookings
    let bookings = await getBookings()

    if (clearAll) {
      // Clear all bookings
      bookings = []
      await saveBookings(bookings)
      return NextResponse.json(
        { message: 'All bookings cleared successfully' },
        { status: 200 }
      )
    } else if (id) {
      // Delete specific booking
      const initialLength = bookings.length
      bookings = bookings.filter((booking: any) => booking.id !== id)
      
      if (bookings.length === initialLength) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }

      await saveBookings(bookings)
      return NextResponse.json(
        { message: 'Booking deleted successfully' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Either id or clearAll parameter is required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    )
  }
}
