'use client'

import { useState } from 'react'

export default function WaitlistForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [school, setSchool] = useState('')
  const [destination, setDestination] = useState('')
  const [referrerName, setReferrerName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Get available destinations based on selected school
  const getAvailableDestinations = () => {
    if (!school) return []
    const allSchools = [
      { value: 'uiuc', label: 'University of Illinois Urbana-Champaign (UIUC)' },
      { value: 'iu', label: 'Indiana University Bloomington (IU)' },
      { value: 'purdue', label: 'Purdue University' },
    ]
    return allSchools.filter(s => s.value !== school)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!name || !name.trim()) {
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

    if (!school) {
      setErrorMessage('Please select your school')
      setStatus('error')
      return
    }

    if (!destination) {
      setErrorMessage('Please select your desired destination')
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: name.trim(),
          email, 
          school, 
          destination,
          referrerName: referrerName.trim() || undefined 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('API Error:', data)
        setErrorMessage(data.error || 'Failed to join waitlist. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
      setName('')
      setEmail('')
      setSchool('')
      setDestination('')
      setReferrerName('')
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus('idle')
      }, 5000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrorMessage('Something went wrong. Please try again later.')
      setStatus('error')
    }
  }

  return (
    <section id="waitlist-form" className="py-8 md:py-12 bg-gradient-to-br from-blue-50 via-blue-100 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join the Waitlist
          </h2>
          <p className="text-lg text-gray-700">
            Be among the first to know when UniLink launches. Help us gauge interest and shape the service!
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-blue-200">
          {/* Referral Contest Banner */}
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Referral Contest!</p>
                <p className="text-sm text-yellow-800">
                  The <strong>top 3 users</strong> with the most referrals will receive <strong>free tickets</strong> when we launch!
                </p>
              </div>
            </div>
          </div>

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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                disabled={status === 'loading'}
                required
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                disabled={status === 'loading'}
                required
              />
            </div>

            <div>
              <label htmlFor="school" className="block text-sm font-semibold text-gray-700 mb-2">
                Your School
              </label>
              <select
                id="school"
                value={school}
                onChange={(e) => {
                  setSchool(e.target.value)
                  setDestination('') // Reset destination when school changes
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                disabled={status === 'loading'}
                required
              >
                <option value="">Select your school</option>
                <option value="uiuc">University of Illinois Urbana-Champaign (UIUC)</option>
                <option value="iu">Indiana University Bloomington (IU)</option>
                <option value="purdue">Purdue University</option>
              </select>
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-semibold text-gray-700 mb-2">
                Desired Destination
              </label>
              <select
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                disabled={status === 'loading' || !school}
                required
              >
                <option value="">
                  {school ? 'Select your desired destination' : 'Select your school first'}
                </option>
                {getAvailableDestinations().map((dest) => (
                  <option key={dest.value} value={dest.value}>
                    {dest.label}
                  </option>
                ))}
              </select>
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
                placeholder="Enter referrer's full name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                disabled={status === 'loading'}
              />
              <p className="mt-2 text-xs text-gray-500">
                Enter the <strong>full name</strong> of the person who referred you. Top 3 referrers get free tickets!
              </p>
            </div>

            {errorMessage && status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <p className="font-semibold">Thanks for joining!</p>
                <p className="text-sm mt-1">We'll keep you updated as we launch UniLink.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {status === 'loading' ? 'Joining...' : status === 'success' ? 'Joined!' : 'Join Waitlist'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600 text-center">
            By joining, you agree to receive updates about UniLink. We'll never spam you or share your information.
          </p>
        </div>
      </div>
    </section>
  )
}
