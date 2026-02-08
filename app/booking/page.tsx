'use client'

import { useState } from 'react'
import Link from 'next/link'

const TRIP_DEPARTURE = 'March 6, 2025 at 6:00 PM'
const TRIP_RETURN = 'March 8, 2025 at 6:00 PM'
const DEPARTURE_DATE = new Date('2025-03-06') // March 6, 2025
const ROUND_TRIP_PRICE = 60 // Only route: Purdue → UIUC round trip
const LUGGAGE_PRICE = 7.5
const LAST_MINUTE_FEE = 5
const LAST_MINUTE_DAYS = 5

const ROUTE_VALUE = 'purdue-uiuc' as const
const ROUTE_LABEL = 'Purdue → UIUC (Round Trip)'

function isWithinLastMinuteWindow(): boolean {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const departure = new Date(DEPARTURE_DATE)
  departure.setHours(0, 0, 0, 0)
  const daysUntil = (departure.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  // Only apply last-minute fee when booking is 1–5 days before March 6 (not on departure day or earlier)
  return daysUntil >= 1 && daysUntil <= LAST_MINUTE_DAYS
}

export default function BookingPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [referrerName, setReferrerName] = useState('')
  const [addLuggage, setAddLuggage] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const lastMinute = isWithinLastMinuteWindow()

  const subtotal =
    ROUND_TRIP_PRICE + (addLuggage ? LUGGAGE_PRICE : 0) + (lastMinute ? LAST_MINUTE_FEE : 0)

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
          route: ROUTE_VALUE,
          roundTrip: true,
          referrerName: referrerName.trim() || undefined,
          addLuggage,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to start checkout. Please try again.')
        setStatus('error')
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

            <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-gray-600 mb-1">Route</div>
              <div className="text-lg font-bold text-gray-900">{ROUTE_LABEL}</div>
              <p className="mt-1 text-sm text-gray-600">
                Depart March 6, 6:00 PM; return March 8, 6:00 PM. <strong>$30 × 2</strong>
              </p>
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
              <div className="flex justify-between text-gray-700">
                <span>Purdue → UIUC round trip</span>
                <span>$30 × 2</span>
              </div>
              {addLuggage && (
                <div className="flex justify-between text-gray-700">
                  <span>Carry-on luggage</span>
                  <span>${LUGGAGE_PRICE.toFixed(2)}</span>
                </div>
              )}
              {lastMinute && (
                <div className="flex justify-between text-gray-700">
                  <span>Last-minute booking (within 5 days of departure)</span>
                  <span>${LAST_MINUTE_FEE.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-amber-900">
                <strong>Last-minute booking fee:</strong> A $5 fee applies when you book between 1 and 5 days before the departure date (March 6, 2025). Book earlier to avoid this fee.
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
        </div>
      </div>
    </div>
  )
}
