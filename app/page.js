import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#8A784E] text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Never Let Them Fly Alone
          </h1>
          <p className="text-xl text-white-200 mb-8 max-w-2xl mx-auto">
            Find a trusted travel companion for your elderly parents or first-time
            student travelers on the same flight.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="bg-[#E7EFC7] text-[#222831] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white transition"
            >
              Find a Companion
            </Link>
            <Link
              href="/post"
              className="border-2 border-[#E7EFC7] text-[#E7EFC7] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#E7EFC7] hover:text-[#222831] transition"
            >
              I Can Help — Post My Trip
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-[#3B3B1A]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">

            <div className="text-center p-6 bg-[#E7EFC7] rounded-xl">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <g stroke="#000000" strokeWidth="2">
                    <path strokeLinejoin="round" d="M4 6a1 1 0 011-1h14a1 1 0 011 1v4H4V6z"/>
                    <path strokeLinecap="round" d="M8 6.5v-3"/>
                    <path strokeLinecap="round" d="M16 6.5v-3"/>
                    <path strokeLinejoin="round" d="M4 10h16v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9z"/>
                  </g>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">1. Post Your Trip</h3>
              <p className="text-black/70 text-sm">
                Share your flight details — route, date, and whether you can help
                or need a companion. Verify via email.
              </p>
            </div>

            <div className="text-center p-6 bg-[#E7EFC7] rounded-xl">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14H9.286C6.919 14 5 15.679 5 17.75V19M19 7v5a2 2 0 01-2 2h-2v5M14 8a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">2. Find a Match</h3>
              <p className="text-black/70 text-sm">
                Search by route and date. Find someone on the same flight
                willing to accompany your loved one.
              </p>
            </div>

            <div className="text-center p-6 bg-[#E7EFC7] rounded-xl">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 19v-1.25C13 15.679 11.081 14 8.714 14H7.286C4.919 14 3 15.679 3 17.75V19m12.286-5h1.428C19.081 14 21 15.679 21 17.75V19M15 5.17a3 3 0 110 5.659M11 8a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">3. Connect Safely</h3>
              <p className="text-black/70 text-sm">
                Send a connection request. The traveler gets your details via email
                and decides whether to respond. No personal info is ever shown publicly.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#222831] mb-12">Who Is This For?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-[#AEC8A4] p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-black mb-3">
                Elderly Parents Traveling
              </h3>
              <p className="text-black/70 text-sm">
                Your Ammi or Abu is flying alone to visit you? Find a kind
                co-passenger who can help them navigate the airport, handle luggage,
                and make the journey comfortable.
              </p>
            </div>
            <div className="bg-[#AEC8A4] p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-black mb-3">
                First-Time Students
              </h3>
              <p className="text-black/70 text-sm">
                Heading abroad for university for the first time? Connect with an
                experienced traveler on the same flight who can guide you through
                immigration, transfers, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-16 bg-[#3B3B1A]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Built on Trust</h2>
          <div className="grid md:grid-cols-3 gap-6">

            <div className="text-center p-6 bg-[#E7EFC7] rounded-xl">
              <div className="flex justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24">
                  <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 7.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0 0 .211-.106a4 4 0 0 1 3.578 0L14 7.5m0 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Zm-2 6.303c5-3 5 3.5 9 1.767-1 4.233-6 4.233-9 1.233-3 3-8 3-9-1.233 4 1.733 4-4.767 9-1.767Z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2">Privacy First</h3>
              <p className="text-black/70 text-sm">
                Your email, phone, and full name are never shown publicly.
                Contact details are shared only when you send a connection request.
              </p>
            </div>

            <div className="text-center p-6 bg-[#E7EFC7] rounded-xl">
              <div className="flex justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24">
                  <g stroke="#000000" strokeWidth="2">
                    <path strokeLinejoin="round" d="M20 6H4a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V7a1 1 0 00-1-1z"/>
                    <path strokeLinecap="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8"/>
                  </g>
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2">Email Verified</h3>
              <p className="text-black/70 text-sm">
                Every trip posting is verified via email before it goes live.
                No fake posts.
              </p>
            </div>

            <div className="text-center p-6 bg-[#E7EFC7] rounded-xl">
              <div className="flex justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24">
                  <path stroke="#000000" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.574-1.635-4.46-2.135-6.035-.5-1.573 1.635-1.34 3.836 0 5.752C7.306 15.168 9.41 16.89 12 19c2.59-2.11 4.694-3.832 6.035-5.748 1.34-1.916 1.573-4.117 0-5.752C16.46 5.865 13.574 6.365 12 8Z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2">Free & Open Source</h3>
              <p className="text-black/70 text-sm">
                No hidden costs, no premium plans. This is a community project
                built with care.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#8A784E] text-white text-center">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to help or need help?</h2>
          <p className="text-white-200 mb-8 text-lg">It takes less than a minute to post your trip.</p>
          <Link
            href="/post"
            className="bg-[#E7EFC7] text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white transition"
          >
            Post Your Trip Now
          </Link>
        </div>
      </section>
    </div>
  )
}