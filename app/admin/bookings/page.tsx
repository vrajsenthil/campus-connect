'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Booking {
  id: string
  name?: string
  email: string
  homeLocation?: string
  destination?: string
  route?: string
  roundTrip?: boolean
  lastMinuteFee?: boolean
  referrerName?: string | null
  addLuggage?: boolean
  tripDeparture?: string
  tripReturn?: string
  amountTotal?: number
  status: string
  createdAt: string
}

export default function BookingsAdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRoute, setSelectedRoute] = useState<string>('all')

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bookings')
      const data = await response.json()
      
      if (response.ok) {
        setBookings(data.bookings || [])
      } else {
        setError('Failed to load bookings')
      }
    } catch (err) {
      setError('Error loading bookings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const getSchoolDisplayName = (school: string) => {
    const schoolMap: { [key: string]: string } = {
      uiuc: 'UIUC',
      iu: 'IU',
      purdue: 'Purdue',
    }
    return schoolMap[school] || school
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getBookingRoute = (booking: Booking) =>
    booking.route || (booking.homeLocation && booking.destination ? `${booking.homeLocation}-${booking.destination}` : '')

  // Get all available routes from bookings
  const getAllRoutes = () => {
    const routes = new Set<string>()
    bookings.forEach(booking => {
      const r = getBookingRoute(booking)
      if (r) routes.add(r)
    })
    return Array.from(routes).sort()
  }

  // Filter bookings by selected route
  const filteredBookings = selectedRoute === 'all'
    ? bookings
    : bookings.filter(booking => getBookingRoute(booking) === selectedRoute)

  // Count bookings by route (using filtered bookings for stats)
  const routeCounts = filteredBookings.reduce((acc, booking) => {
    const r = getBookingRoute(booking)
    if (r) acc[r] = (acc[r] || 0) + 1
    return acc
  }, {} as { [key: string]: number })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-700 mb-2">Loading...</div>
          <div className="text-gray-500">Fetching bookings</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Bookings Admin
              </h1>
              <p className="text-lg text-gray-600">
                View all ticket bookings for UniLink
              </p>
            </div>
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ← Back to Waitlist
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">{filteredBookings.length}</div>
            <div className="text-gray-600">
              {selectedRoute === 'all' ? 'Total Bookings' : 'Filtered Bookings'}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {filteredBookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {filteredBookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-gray-600 mb-1">
              {Object.keys(routeCounts).length}
            </div>
            <div className="text-gray-600">Active Routes</div>
          </div>
        </div>

        {/* Route Statistics */}
        {Object.keys(routeCounts).length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bookings by Route</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(routeCounts).map(([route, count]) => {
                const [from, to] = route.split('-')
                return (
                  <div key={route} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-lg font-semibold text-gray-900 mb-1">
                      {getSchoolDisplayName(from)} → {getSchoolDisplayName(to)}
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{count}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Filter and Action Buttons */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="routeFilter" className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Route
            </label>
            <select
              id="routeFilter"
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
            >
              <option value="all">All Routes</option>
              {getAllRoutes().map((route) => {
                const [from, to] = route.split('-')
                return (
                  <option key={route} value={route}>
                    {getSchoolDisplayName(from)} → {getSchoolDisplayName(to)}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="flex gap-3 items-end">
            <button
              onClick={fetchBookings}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Refresh
            </button>
            {bookings.length > 0 && (
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to clear all bookings? This action cannot be undone.')) {
                    try {
                      const response = await fetch('/api/bookings?clearAll=true', {
                        method: 'DELETE',
                      })
                      if (response.ok) {
                        await fetchBookings()
                        setSelectedRoute('all') // Reset filter after clearing
                      } else {
                        setError('Failed to clear bookings')
                      }
                    } catch (err) {
                      setError('Error clearing bookings')
                      console.error(err)
                    }
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">
                {bookings.length === 0 
                  ? 'No bookings yet.' 
                  : selectedRoute !== 'all'
                  ? 'No bookings found for the selected route.'
                  : 'No bookings yet.'}
              </p>
              <p className="text-sm mt-2">
                {bookings.length === 0
                  ? 'Bookings will appear here once people start booking tickets.'
                  : 'Try selecting a different route or clear the filter.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Round Trip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Min.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referred By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Luggage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booked
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking, index) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.name || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(() => {
                          const r = getBookingRoute(booking)
                          if (!r) return '—'
                          const [from, to] = r.split('-')
                          return (
                            <>
                              <span className="font-semibold">{getSchoolDisplayName(from)}</span>
                              {' → '}
                              <span className="font-semibold">{getSchoolDisplayName(to)}</span>
                            </>
                          )
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.roundTrip ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.lastMinuteFee ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.referrerName ? (
                          <span className="font-medium text-blue-600">{booking.referrerName}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.addLuggage ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete this booking?`)) {
                              try {
                                const response = await fetch(`/api/bookings?id=${booking.id}`, {
                                  method: 'DELETE',
                                })
                                if (response.ok) {
                                  await fetchBookings()
                                } else {
                                  setError('Failed to delete booking')
                                }
                              } catch (err) {
                                setError('Error deleting booking')
                                console.error(err)
                              }
                            }
                          }}
                          className="text-red-600 hover:text-red-800 font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Export Button */}
        {filteredBookings.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => {
                const csv = [
                  ['Name', 'Email', 'Route', 'Round Trip', 'Last Minute', 'Referred By', 'Luggage', 'Status', 'Booked'],
                  ...filteredBookings.map(booking => {
                    const r = getBookingRoute(booking)
                    const [from, to] = r ? r.split('-') : ['', '']
                    return [
                      booking.name || 'N/A',
                      booking.email,
                      r ? `${getSchoolDisplayName(from)} → ${getSchoolDisplayName(to)}` : 'N/A',
                      booking.roundTrip ? 'Yes' : 'No',
                      booking.lastMinuteFee ? 'Yes' : 'No',
                      booking.referrerName || 'N/A',
                      booking.addLuggage ? 'Yes' : 'No',
                      booking.status,
                      formatDate(booking.createdAt),
                    ]
                  }),
                ]
                  .map(row => row.map(cell => `"${cell}"`).join(','))
                  .join('\n')

                const blob = new Blob([csv], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                const routeSuffix = selectedRoute !== 'all' 
                  ? `-${selectedRoute.replace('-', '-to-')}` 
                  : ''
                a.download = `bookings${routeSuffix}-${new Date().toISOString().split('T')[0]}.csv`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Export to CSV {selectedRoute !== 'all' && '(Filtered)'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
