import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const ROUND_TRIP_PRICE_CENTS = 6000 // $60 — only route: Purdue → UIUC round trip
const LUGGAGE_PRICE_CENTS = 750 // $7.50
const LAST_MINUTE_FEE_CENTS = 500 // $5
const DEPARTURE_DATE = new Date('2025-03-06')
const LAST_MINUTE_DAYS = 5

const ONLY_ROUTE = 'purdue-uiuc' as const

function parseRoute(route: string): { homeLocation: string; destination: string } | null {
  if (route !== ONLY_ROUTE) return null
  return { homeLocation: 'purdue', destination: 'uiuc' }
}

function isWithinLastMinuteWindow(): boolean {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const departure = new Date(DEPARTURE_DATE)
  departure.setHours(0, 0, 0, 0)
  const daysUntil = (departure.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  // Only apply last-minute fee when booking is 1–5 days before March 6 (not on departure day or earlier)
  return daysUntil >= 1 && daysUntil <= LAST_MINUTE_DAYS
}

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim()
    if (!stripeSecretKey) {
      return NextResponse.json(
        {
          error:
            'Payment is not configured. Add STRIPE_SECRET_KEY to .env.local and restart the dev server (or set it in your hosting dashboard).',
        },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey)
    const body = await request.json()
    const { name, email, route, referrerName, addLuggage } = body
    const effectiveRoute = route || ONLY_ROUTE

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const parsed = parseRoute(effectiveRoute)
    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid route. Only Purdue → UIUC round trip is available.' },
        { status: 400 }
      )
    }

    const { homeLocation, destination } = parsed

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const lastMinute = isWithinLastMinuteWindow()
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'UniLink Purdue → UIUC Round Trip Bus Ticket',
            description: `March 6, 6:00 PM – March 8, 6:00 PM. Purdue to UIUC round trip. Arrive 10 minutes before 6:00 PM departure.`,
            images: [],
          },
          unit_amount: ROUND_TRIP_PRICE_CENTS,
        },
        quantity: 1,
      },
    ]

    if (addLuggage) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Carry-on sized luggage',
            description: 'One carry-on sized luggage add-on',
            images: [],
          },
          unit_amount: LUGGAGE_PRICE_CENTS,
        },
        quantity: 1,
      })
    }

    if (lastMinute) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Last-minute booking fee',
            description: 'Booking within 5 days of departure (March 6, 2025)',
            images: [],
          },
          unit_amount: LAST_MINUTE_FEE_CENTS,
        },
        quantity: 1,
      })
    }

    const origin = request.headers.get('origin') || request.nextUrl.origin
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking?cancelled=1`,
      customer_email: email,
      metadata: {
        name: name.trim(),
        email: email.toLowerCase(),
        route: effectiveRoute,
        homeLocation,
        destination,
        roundTrip: 'true',
        referrerName: referrerName?.trim() || '',
        addLuggage: addLuggage ? 'true' : 'false',
        lastMinute: lastMinute ? 'true' : 'false',
      },
    })

    return NextResponse.json({ url: checkoutSession.url }, { status: 200 })
  } catch (error) {
    console.error('Checkout error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to create checkout: ${message}` },
      { status: 500 }
    )
  }
}
