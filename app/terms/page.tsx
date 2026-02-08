import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service - UniLink',
  description: 'UniLink interstate bus booking terms of service.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8"
        >
          ← Back to UniLink
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-10">Last updated: {new Date().toLocaleDateString('en-US')}</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Agreement</h2>
            <p>
              By booking a trip with UniLink (“we,” “us,” “our”), you agree to these Terms of Service. 
              UniLink provides interstate bus transportation between college campuses. Booking constitutes 
              acceptance of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Trip Details</h2>
            <p>
              Trip times and dates are as stated at the time of booking. Passengers must arrive at least 
              <strong> 10 (ten) minutes before the scheduled departure time</strong> (6:00 PM unless otherwise 
              stated). Boarding may close before departure. UniLink is not responsible for missed trips due 
              to late arrival.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Payment and Fees</h2>
            <p>
              All fares and fees (including optional carry-on luggage) are due at the time of booking. 
              Payment is processed via our payment provider. Prices are in U.S. dollars and are subject 
              to change for future bookings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. No Refunds</h2>
            <p>
              <strong>All sales are final. UniLink does not offer refunds</strong>, including for 
              no-shows, missed departures, change of plans, or cancellation by the passenger. In the 
              event UniLink cancels a trip (e.g., weather, safety, or operational reasons), we will 
              offer a reschedule or credit toward a future trip at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Luggage</h2>
            <p>
              One personal item is included. Optional carry-on sized luggage may be added for an 
              additional fee as shown at booking. Luggage must meet size and weight limits. We are 
              not liable for lost, damaged, or delayed baggage beyond our control. Prohibited items 
              are not allowed and may result in refusal of transport.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Passenger Conduct</h2>
            <p>
              Passengers must follow driver and staff instructions, behave in a safe and respectful 
              manner, and comply with applicable laws. We reserve the right to refuse transport or 
              remove any passenger whose conduct is disruptive, unsafe, or in violation of these terms. 
              No refund will be given in such cases.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, UniLink’s liability for any claim arising from 
              your trip is limited to the amount you paid for that trip. We are not liable for 
              indirect, incidental, consequential, or punitive damages, or for delays, missed 
              connections, or events beyond our reasonable control (e.g., weather, road conditions, 
              accidents).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Interstate Transportation</h2>
            <p>
              Service is provided between states. You are responsible for having valid ID and 
              complying with any applicable travel requirements. Routes, stops, and schedules are 
              subject to change; we will make reasonable efforts to notify passengers of material 
              changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact</h2>
            <p>
              For questions about these terms or your booking, contact us through the contact 
              information provided on the UniLink website.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/booking"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue to Booking
          </Link>
        </div>
      </div>
    </div>
  )
}
