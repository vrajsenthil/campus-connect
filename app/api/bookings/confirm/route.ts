import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from 'redis'

const BOOKINGS_KEY = 'bookings:entries'
let redisClient: ReturnType<typeof createClient> | null = null

async function getRedisClient() {
  if (!redisClient) {
    const url = process.env.REDIS_URL
    if (!url) throw new Error('REDIS_URL is not set')
    redisClient = createClient({ url })
    redisClient.on('error', (err) => console.error('Redis Error:', err))
    await redisClient.connect()
  }
  return redisClient
}

async function getBookings() {
  try {
    const client = await getRedisClient()
    const data = await client.get(BOOKINGS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading bookings:', error)
    return []
  }
}

async function saveBookings(bookings: any[]) {
  const client = await getRedisClient()
  await client.set(BOOKINGS_KEY, JSON.stringify(bookings))
}

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim()
    if (!stripeSecretKey) {
      return NextResponse.json(
        {
          error:
            'Payment is not configured. Add STRIPE_SECRET_KEY to .env.local and restart the dev server.',
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { session_id } = body
    if (!session_id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const stripe = new Stripe(stripeSecretKey)
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment was not completed' },
        { status: 400 }
      )
    }

    const metadata = session.metadata
    const homeLocation = metadata?.homeLocation
    const destination = metadata?.destination
    const route = metadata?.route

    if (!metadata?.email || (!homeLocation && !destination && !route)) {
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 400 }
      )
    }

    const bookings = await getBookings()
    const existingBySession = bookings.find((b: any) => b.stripeSessionId === session_id)
    if (existingBySession) {
      return NextResponse.json(
        { message: 'Booking already confirmed', booking: existingBySession },
        { status: 200 }
      )
    }

    const newBooking = {
      id: Date.now().toString(),
      stripeSessionId: session_id,
      name: metadata.name || '',
      email: metadata.email.toLowerCase(),
      phone: metadata.phone || null,
      homeLocation: homeLocation || (route ? route.split('-')[0] : ''),
      destination: destination || (route ? route.split('-')[1] : ''),
      route: route || `${homeLocation}-${destination}`,
      roundTrip: metadata.roundTrip === 'true',
      returnOnly: metadata.returnOnly === 'true',
      referrerName: metadata.referrerName || null,
      addLuggage: metadata.addLuggage === 'true',
      lastMinuteFee: metadata.lastMinute === 'true',
      tripDeparture: '2025-03-06T18:00:00',
      tripReturn: '2025-03-08T18:00:00',
      amountTotal: session.amount_total || 0,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    }

    bookings.push(newBooking)
    await saveBookings(bookings)

    return NextResponse.json(
      { message: 'Booking confirmed', booking: newBooking },
      { status: 201 }
    )
  } catch (error) {
    console.error('Confirm booking error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to confirm booking: ${message}` },
      { status: 500 }
    )
  }
}
