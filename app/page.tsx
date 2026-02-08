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
      <footer className="bg-slate-900 text-gray-300 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl font-bold text-white mb-2">UniLink</p>
            <p className="text-sm mb-4 text-gray-400">Connecting students across college campuses</p>
            <p className="text-sm mb-2">
              <a href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
              {' · '}
              <a href="/booking" className="text-blue-400 hover:text-blue-300">Book Now</a>
            </p>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} UniLink. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
