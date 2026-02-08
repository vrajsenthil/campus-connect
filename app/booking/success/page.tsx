'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [booking, setBooking] = useState<{
    name?: string
    email?: string
    homeLocation?: string
    destination?: string
    route?: string
    roundTrip?: boolean
    addLuggage?: boolean
    tripDeparture?: string
    tripReturn?: string
  } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setError('Invalid session. Please start your booking again.')
      return
    }

    const confirm = async () => {
      try {
        const res = await fetch('/api/bookings/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        })
        const data = await res.json()

        if (!res.ok) {
          setStatus('error')
          setError(data.error || 'Failed to confirm booking.')
          return
        }

        setBooking(data.booking)
        setStatus('success')
      } catch (err) {
        console.error(err)
        setStatus('error')
        setError('Something went wrong. Please contact support with your payment details.')
      }
    }

    confirm()
  }, [sessionId])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-700 mb-2">Confirming your booking...</div>
          <div className="text-gray-500">Please wait.</div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Issue</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/booking"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block mt-4 text-blue-600 hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const routeLabel =
    booking?.homeLocation && booking?.destination
      ? `${booking.homeLocation.toUpperCase()} → ${booking.destination.toUpperCase()}`
      : booking?.route
        ? booking.route.replace('-', ' → ').toUpperCase()
        : ''

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed</h1>
          <p className="text-gray-600 mb-6">
            Thank you for booking with UniLink. Arrive at least 10 minutes before 6:00 PM on March 6.
          </p>

          {booking && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-3 text-gray-700">
              {booking.name && (
                <p><strong>Name:</strong> {booking.name}</p>
              )}
              {booking.email && (
                <p><strong>Email:</strong> {booking.email}</p>
              )}
              {routeLabel && (
                <p><strong>Route:</strong> {routeLabel}</p>
              )}
              {booking.roundTrip && (
                <p><strong>Trip type:</strong> Round trip</p>
              )}
              <p><strong>Departure:</strong> March 6, 2025 at 6:00 PM</p>
              <p><strong>Return:</strong> March 8, 2025 at 6:00 PM</p>
              {booking.addLuggage && (
                <p><strong>Luggage:</strong> Carry-on included</p>
              )}
            </div>
          )}

          <p className="text-sm text-gray-600 mb-4">
            Your confirmation email may take <strong>up to 24 hours</strong> to arrive. If you do not receive it within 24 hours, please contact us.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            No refunds per our Terms of Service.
          </p>

          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to UniLink
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-700 mb-2">Confirming your booking...</div>
            <div className="text-gray-500">Please wait.</div>
          </div>
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  )
}
