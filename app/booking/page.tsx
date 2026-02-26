'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const TRIP_DEPARTURE = 'March 6, 2025 at 6:00 PM'
const TRIP_RETURN = 'March 8, 2025 at 6:00 PM'
const ONE_WAY_PRICE = 30
const ROUND_TRIP_PRICE = 60 // $30 × 2
const LUGGAGE_PRICE = 7.5
const LAST_MINUTE_FEE = 5

const ROUTE_VALUE = 'purdue-uiuc' as const
const ROUTE_LABEL_TWO_WAY = 'Purdue ↔ UIUC'

const DEPARTURE_DATETIME = new Date('2025-03-06T18:00:00') // March 6, 6:00 PM local
const LAST_MINUTE_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours

function isWithinLastMinuteWindow(): boolean {
  const now = new Date()
  const cutoff = new Date(DEPARTURE_DATETIME.getTime() - LAST_MINUTE_WINDOW_MS)
  return now >= cutoff && now < DEPARTURE_DATETIME
}

type TripType = 'one-way' | 'round-trip' | 'return-only'

const TICKET_LIMIT = 35

export default function BookingPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [tripType, setTripType] = useState<TripType>('round-trip')
  const [referrerName, setReferrerName] = useState('')
  const [addLuggage, setAddLuggage] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [soldOut, setSoldOut] = useState(false)
  const [capacityLoading, setCapacityLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bookings/capacity')
      .then((res) => res.json())
      .then((data) => setSoldOut(data.soldOut === true))
      .catch(() => setSoldOut(false))
      .finally(() => setCapacityLoading(false))
  }, [])

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const lastMinute = isWithinLastMinuteWindow()
  const baseFare = tripType === 'round-trip' ? ROUND_TRIP_PRICE : ONE_WAY_PRICE
  const subtotal =
    baseFare + (addLuggage ? LUGGAGE_PRICE : 0) + (lastMinute ? LAST_MINUTE_FEE : 0)
  const roundTrip = tripType === 'round-trip'
  const returnOnly = tripType === 'return-only'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!name?.trim()) {
      setErrorMessage('Please enter your full name')
      setStatus('error')
      return
    }
    if (!email) {
      setErrorMessage('Please enter your email address')
      setStatus('error')
      return
    }
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address')
      setStatus('error')
      return
    }
    if (!acceptTerms) {
      setErrorMessage('You must accept the Terms of Service to book')
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/bookings/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email,
          phone: phone.trim() || undefined,
          route: ROUTE_VALUE,
          roundTrip,
          returnOnly,
          referrerName: referrerName.trim() || undefined,
          addLuggage,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to start checkout. Please try again.')
        setStatus('error')
        if (data.error && data.error.includes('Sold out')) {
          setSoldOut(true)
        }
        return
      }

      if (data.url) {
        window.location.href = data.url
        return
      }

      setErrorMessage('Invalid response from server. Please try again.')
      setStatus('error')
    } catch (err) {
      console.error(err)
      setErrorMessage('Something went wrong. Please try again later.')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          ← Back to UniLink
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Book Your Trip</h1>
          <p className="text-gray-600 mb-6">
            March 6, 6:00 PM – March 8, 6:00 PM. Arrive at least 10 minutes before 6:00 PM departure.
          </p>

          {capacityLoading ? (
            <div className="py-12 text-center text-gray-500">
              Checking availability…
            </div>
          ) : soldOut ? (
            <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-8 text-center">
              <h2 className="text-2xl font-bold text-amber-900 mb-2">Sold Out</h2>
              <p className="text-amber-800 mb-4">
                All {TICKET_LIMIT} tickets have been sold. This trip is sold out and we are not accepting any more bookings.
              </p>
              <Link
                href="/"
                className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Back to UniLink
              </Link>
            </div>
          ) : (
          <>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
                disabled={status === 'loading'}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@university.edu"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
                disabled={status === 'loading'}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={status === 'loading'}
              />
            </div>

            <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-gray-600 mb-1">Route</div>
              <div className="text-lg font-bold text-gray-900">{ROUTE_LABEL_TWO_WAY}</div>
              <p className="mt-1 text-sm text-gray-600">
                {tripType === 'round-trip'
                  ? 'Depart March 6, 6:00 PM; return March 8, 6:00 PM. $30 × 2'
                  : tripType === 'return-only'
                    ? 'Return March 8, 6:00 PM only. $30'
                    : 'Depart March 6, 6:00 PM only. $30'}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 sm:gap-6">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="tripType"
                    checked={tripType === 'one-way'}
                    onChange={() => setTripType('one-way')}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={status === 'loading'}
                  />
                  <span className="font-medium text-gray-900">One-way</span>
                  <span className="text-gray-600">$30</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="tripType"
                    checked={tripType === 'round-trip'}
                    onChange={() => setTripType('round-trip')}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={status === 'loading'}
                  />
                  <span className="font-medium text-gray-900">Round trip</span>
                  <span className="text-gray-600">$60 ($30 × 2)</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="tripType"
                    checked={tripType === 'return-only'}
                    onChange={() => setTripType('return-only')}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={status === 'loading'}
                  />
                  <span className="font-medium text-gray-900">Return only</span>
                  <span className="text-gray-600">$30</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="referrerName" className="block text-sm font-semibold text-gray-700 mb-2">
                Referred By <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                id="referrerName"
                value={referrerName}
                onChange={(e) => setReferrerName(e.target.value)}
                placeholder="Referrer's full name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={status === 'loading'}
              />
              <p className="mt-1.5 text-sm text-gray-500">
                Enter the <strong>full name</strong> of the person who referred you. Top 3 referrers get free tickets!
              </p>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="addLuggage"
                checked={addLuggage}
                onChange={(e) => setAddLuggage(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={status === 'loading'}
              />
              <label htmlFor="addLuggage" className="text-sm text-gray-700">
                Add carry-on sized luggage <strong>+${LUGGAGE_PRICE.toFixed(2)}</strong>
              </label>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between items-center text-gray-700">
                <span className="flex items-center gap-2">
                  {tripType === 'return-only' ? (
                    <>UIUC → Purdue <span className="text-gray-500 font-medium">return only</span></>
                  ) : tripType === 'one-way' ? (
                    <>Purdue → UIUC <span className="text-gray-500 font-medium">one-way</span></>
                  ) : (
                    <>Purdue ↔ UIUC <span className="text-gray-500 font-medium">round trip</span></>
                  )}
                </span>
                <span>{tripType === 'round-trip' ? '$30 × 2' : '$30.00'}</span>
              </div>
              {addLuggage && (
                <div className="flex justify-between text-gray-700">
                  <span>Carry-on luggage</span>
                  <span>${LUGGAGE_PRICE.toFixed(2)}</span>
                </div>
              )}
              {lastMinute && (
                <div className="flex justify-between text-gray-700">
                  <span>Late fee (booked within 24 hours of departure)</span>
                  <span>${LAST_MINUTE_FEE.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-amber-900">
                <strong>24-hour late fee:</strong> A $5 fee applies when you book within 24 hours of the March 6, 6:00 PM departure. Book earlier to avoid this fee.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between font-semibold text-gray-900 text-lg pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={status === 'loading'}
                required
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                I have read and agree to the{' '}
                <Link href="/terms" target="_blank" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>
                , including no refunds and arriving 10 minutes before 6:00 PM departure.
              </label>
            </div>

            {errorMessage && status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {status === 'loading' ? 'Redirecting to payment...' : 'Book Now'}
            </button>
          </form>
          <p className="mt-6 text-sm text-gray-500 text-center">
            You will be redirected to our secure payment provider to complete your booking.
          </p>
          </>
          )}
        </div>
      </div>
    </div>
  )
}
