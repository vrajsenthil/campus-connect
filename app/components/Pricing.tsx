export default function Pricing() {
  return (
    <section id="pricing" className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Student Prices, Not Tourist Prices
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Affordable transportation designed specifically for students on a budget
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Launch Pricing
              </div>
              <div className="mb-6">
                <div className="text-2xl md:text-3xl text-gray-600 mb-2">Starting at</div>
                <span className="text-5xl md:text-6xl font-bold text-gray-900">$30</span>
              </div>
              <p className="text-xl text-gray-700 mb-2">per one-way trip</p>
              <p className="text-gray-500">Prices vary by route and demand</p>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Why it's affordable:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Student discounts</div>
                    <div className="text-gray-600 text-sm">Special rates for verified students</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">No hidden fees</div>
                    <div className="text-gray-600 text-sm">Transparent pricing, period</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Early bird specials</div>
                    <div className="text-gray-600 text-sm">Book in advance and save more</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Round-trip savings</div>
                    <div className="text-gray-600 text-sm">Discounts when you book both ways</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-gray-700 text-center">
                <span className="font-semibold">Save even more:</span> Compared to driving ($30-50 in gas + wear) 
                or other transportation options, UniLink keeps your money where it belongs—in your wallet.
              </p>
            </div>

            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-sm text-gray-600 text-center">
                <strong>Last-minute booking fee:</strong> A $5 fee applies when you book between 1 and 5 days before the departure date. Book in advance to avoid this fee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
