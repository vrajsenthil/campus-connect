'use client'

import { useState, useEffect } from 'react'

interface WaitlistEntry {
  id: string
  email: string
  school: string
  destination?: string
  createdAt: string
}

export default function AdminPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchEntries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/waitlist')
      const data = await response.json()
      
      if (response.ok) {
        setEntries(data.entries || [])
      } else {
        setError('Failed to load waitlist entries')
      }
    } catch (err) {
      setError('Error loading waitlist entries')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  const getSchoolDisplayName = (school: string) => {
    const schoolMap: { [key: string]: string } = {
      uiuc: 'University of Illinois Urbana-Champaign (UIUC)',
      iu: 'Indiana University Bloomington (IU)',
      purdue: 'Purdue University',
    }
    return schoolMap[school] || school
  }

  const getDestinationDisplayName = (destination: string) => {
    const schoolMap: { [key: string]: string } = {
      uiuc: 'UIUC',
      iu: 'IU',
      purdue: 'Purdue',
    }
    return schoolMap[destination] || destination
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

  const schoolCounts = entries.reduce((acc, entry) => {
    acc[entry.school] = (acc[entry.school] || 0) + 1
    return acc
  }, {} as { [key: string]: number })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-700 mb-2">Loading...</div>
          <div className="text-gray-500">Fetching waitlist entries</div>
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
                Waitlist Admin
              </h1>
              <p className="text-lg text-gray-600">
                View all waitlist signups for UniLink
              </p>
            </div>
            <a
              href="/admin/bookings"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              View Bookings →
            </a>
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
            <div className="text-3xl font-bold text-blue-600 mb-1">{entries.length}</div>
            <div className="text-gray-600">Total Signups</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-orange-600 mb-1">{schoolCounts['uiuc'] || 0}</div>
            <div className="text-gray-600">UIUC</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-red-600 mb-1">{schoolCounts['iu'] || 0}</div>
            <div className="text-gray-600">IU</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{schoolCounts['purdue'] || 0}</div>
            <div className="text-gray-600">Purdue</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-4 flex gap-3 flex-wrap">
          <button
            onClick={fetchEntries}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Refresh
          </button>
          {entries.length > 0 && (
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to clear all entries? This action cannot be undone.')) {
                  try {
                    const response = await fetch('/api/waitlist?clearAll=true', {
                      method: 'DELETE',
                    })
                    if (response.ok) {
                      await fetchEntries()
                    } else {
                      setError('Failed to clear entries')
                    }
                  } catch (err) {
                    setError('Error clearing entries')
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

        {/* Entries Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {entries.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">No waitlist entries yet.</p>
              <p className="text-sm mt-2">Entries will appear here once people start signing up.</p>
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
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      School
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Signed Up
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries.map((entry, index) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getSchoolDisplayName(entry.school)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.destination ? getDestinationDisplayName(entry.destination) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(entry.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete ${entry.email}?`)) {
                              try {
                                const response = await fetch(`/api/waitlist?id=${entry.id}`, {
                                  method: 'DELETE',
                                })
                                if (response.ok) {
                                  await fetchEntries()
                                } else {
                                  setError('Failed to delete entry')
                                }
                              } catch (err) {
                                setError('Error deleting entry')
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
        {entries.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => {
                const csv = [
                  ['Email', 'School', 'Destination', 'Signed Up'],
                  ...entries.map(entry => [
                    entry.email,
                    getSchoolDisplayName(entry.school),
                    entry.destination ? getDestinationDisplayName(entry.destination) : 'N/A',
                    formatDate(entry.createdAt),
                  ]),
                ]
                  .map(row => row.map(cell => `"${cell}"`).join(','))
                  .join('\n')

                const blob = new Blob([csv], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Export to CSV
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
