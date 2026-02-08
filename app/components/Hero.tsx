'use client'
import Image from 'next/image'

export default function Hero() {
  const handleScrollToForm = () => {
    const formSection = document.getElementById('waitlist-form')
    formSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative bg-slate-900 text-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.svg"
              alt="UniLink Logo"
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
            UniLink
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-gray-200">
            Budget-Friendly & Student-Focused
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Connect with friends across college campuses. Affordable bus service connecting 
            <span className="font-semibold text-white"> UIUC, IU, and Purdue</span> for students like you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
            <a
              href="/booking"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Book Now
            </a>
            <button
              onClick={handleScrollToForm}
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
            >
              Join the Waitlist
            </button>
            <button
              onClick={() => {
                const mapSection = document.getElementById('route-map')
                mapSection?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
            >
              See Routes
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
