'use client'

const schools = {
  UIUC: {
    name: 'University of Illinois Urbana-Champaign',
    logo: '/logos/uiuc-logo.png',
  },
  IU: {
    name: 'Indiana University Bloomington',
    logo: '/logos/iu-logo.png',
  },
  Purdue: {
    name: 'Purdue University',
    logo: '/logos/purdue-logo.png',
  },
}

export default function RouteMap() {
  const routes = [
    { from: 'UIUC', to: 'IU', duration: '~2.5 hours' },
    { from: 'UIUC', to: 'Purdue', duration: '~2 hours' },
    { from: 'IU', to: 'Purdue', duration: '~1.5 hours' },
  ]

  return (
    <section id="route-map" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Routes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connecting three major campuses with convenient, direct routes
          </p>
        </div>

        {/* Route Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routes.map((route, index) => {
            const fromSchool = schools[route.from as keyof typeof schools]
            const toSchool = schools[route.to as keyof typeof schools]
            
            return (
              <div
                key={index}
                className="bg-blue-50 p-6 rounded-lg border border-blue-200 hover:shadow-lg transition-shadow"
              >
                {/* School Logos */}
                <div className="flex items-center justify-center gap-6 mb-4">
                  {/* From School Logo */}
                  <div className="flex items-center justify-center w-20 h-20">
                    <img
                      src={fromSchool.logo}
                      alt={`${fromSchool.name} logo`}
                      className={`object-contain ${route.from === 'UIUC' ? 'w-12 h-12' : 'w-20 h-20'}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </div>
                  
                  {/* Arrow */}
                  <div className="flex items-center justify-center text-2xl text-gray-400 h-20">↔</div>
                  
                  {/* To School Logo */}
                  <div className="flex items-center justify-center w-20 h-20">
                    <img
                      src={toSchool.logo}
                      alt={`${toSchool.name} logo`}
                      className={`object-contain ${route.to === 'UIUC' ? 'w-12 h-12' : 'w-20 h-20'}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </div>
                </div>
                
                {/* Route Info */}
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    {route.from} ↔ {route.to}
                  </div>
                  <div className="text-gray-600">
                    Estimated travel time: {route.duration}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
