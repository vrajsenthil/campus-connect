import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const ONE_WAY_PRICE_CENTS = 3000 // $30
const ROUND_TRIP_PRICE_CENTS = 6000 // $60 — Purdue → UIUC
const LUGGAGE_PRICE_CENTS = 750 // $7.50
const LAST_MINUTE_FEE_CENTS = 500 // $5
const DEPARTURE_DATETIME = new Date('2025-03-06T18:00:00') // March 6, 6:00 PM local
const LAST_MINUTE_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours

const ONLY_ROUTE = 'purdue-uiuc' as const

function parseRoute(route: string): { homeLocation: string; destination: string } | null {
  if (route !== ONLY_ROUTE) return null
  return { homeLocation: 'purdue', destination: 'uiuc' }
}

function isWithinLastMinuteWindow(): boolean {
  const now = new Date()
  const cutoff = new Date(DEPARTURE_DATETIME.getTime() - LAST_MINUTE_WINDOW_MS)
  return now >= cutoff && now < DEPARTURE_DATETIME
}

const TICKET_LIMIT = 35

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || request.nextUrl?.origin || ''
    try {
      const capacityRes = await fetch(`${origin}/api/bookings/capacity`)
      const capacity = capacityRes.ok ? await capacityRes.json() : { soldOut: false }
      if (capacity.soldOut) {
        return NextResponse.json(
          { error: `Sold out. All ${TICKET_LIMIT} tickets have been sold.` },
          { status: 400 }
        )
      }
    } catch (_) {
      // If capacity check fails, allow booking (e.g. Redis down)
    }

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
    const { name, email, phone, route, roundTrip, returnOnly, referrerName, addLuggage } = body
    const effectiveRoute = route || ONLY_ROUTE
    const isRoundTrip = roundTrip === true
    const isReturnOnly = returnOnly === true

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const parsed = parseRoute(effectiveRoute)
    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid route. Only Purdue → UIUC is available.' },
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
    const baseCents = isRoundTrip ? ROUND_TRIP_PRICE_CENTS : ONE_WAY_PRICE_CENTS
    const productName = isReturnOnly
      ? 'UniLink Purdue → UIUC Return Only Bus Ticket'
      : isRoundTrip
        ? 'UniLink Purdue → UIUC Round Trip Bus Ticket'
        : 'UniLink Purdue → UIUC One-Way Bus Ticket'
    const productDesc = isReturnOnly
      ? `March 8, 6:00 PM. Purdue to UIUC return only. Arrive 10 minutes before 6:00 PM departure.`
      : isRoundTrip
        ? `March 6, 6:00 PM – March 8, 6:00 PM. Purdue to UIUC round trip. Arrive 10 minutes before 6:00 PM departure.`
        : `March 6, 6:00 PM. Purdue to UIUC one-way. Arrive 10 minutes before 6:00 PM departure.`
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName,
            description: productDesc,
            images: [],
          },
          unit_amount: baseCents,
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
            name: '24-hour late fee',
            description: 'Late fee applied because booking was made within 24 hours of March 6, 6:00 PM departure',
            images: [],
          },
          unit_amount: LAST_MINUTE_FEE_CENTS,
        },
        quantity: 1,
      })
    }

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
        phone: (phone && String(phone).trim()) || '',
        route: effectiveRoute,
        homeLocation,
        destination,
        roundTrip: isRoundTrip ? 'true' : 'false',
        returnOnly: isReturnOnly ? 'true' : 'false',
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
