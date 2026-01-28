'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BookingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl p-12 md:p-16 shadow-xl border border-gray-200">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Booking is not yet available
            </p>
            
            <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto">
              We're putting the finishing touches on our booking system. Join the waitlist to be notified when bookings open and get early access.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#waitlist-form"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Join the Waitlist
            </Link>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-300 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
