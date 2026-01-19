import Hero from './components/Hero'
import Benefits from './components/Benefits'
import RouteMap from './components/RouteMap'
import Pricing from './components/Pricing'
import WaitlistForm from './components/WaitlistForm'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Benefits />
      <RouteMap />
      <Pricing />
      <WaitlistForm />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-semibold text-white mb-2">Campus Connect</p>
            <p className="text-sm mb-4">Connecting students across college campuses</p>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Campus Connect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
