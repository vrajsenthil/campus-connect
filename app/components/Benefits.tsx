export default function Benefits() {
  const benefits = [
    {
      title: 'Budget-Friendly',
      description: 'Student prices designed for your wallet. Affordable transportation that won\'t break the bank.',
    },
    {
      title: 'Direct Routes',
      description: 'Straight from campus to campus. No detours, no extra stops—just efficient travel between schools.',
    },
    {
      title: 'Student Community',
      description: 'Travel with fellow students. Connect, study together, or just enjoy the journey with your peers.',
    },
    {
      title: 'Flexible Scheduling',
      description: 'Rides designed around your academic schedule. Weekends, breaks, and special events covered.',
    },
    {
      title: 'Safe & Reliable',
      description: 'Your safety is our priority. Professional drivers and well-maintained buses for peace of mind.',
    },
    {
      title: 'Easy Booking',
      description: 'Simple online booking. Reserve your seat in seconds and get instant confirmation.',
    },
  ]

  return (
    <section id="benefits" className="py-8 md:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built for Students, by Students
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to visit friends and explore other campuses without the hassle or high costs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
