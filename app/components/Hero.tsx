'use client'

export default function Hero() {
  const handleScrollToForm = () => {
    const formSection = document.getElementById('waitlist-form')
    formSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 md:py-32">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Campus Connect
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-blue-100">
            Budget-Friendly & Student-Focused
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-50 max-w-3xl mx-auto">
            Connect with friends across college campuses. Affordable bus service connecting 
            <span className="font-semibold"> UIUC, IU, and Purdue</span> for students like you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleScrollToForm}
              className="bg-white text-blue-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Join the Waitlist
            </button>
            <button
              onClick={() => {
                const mapSection = document.getElementById('route-map')
                mapSection?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-700 transition-colors"
            >
              See Routes
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
