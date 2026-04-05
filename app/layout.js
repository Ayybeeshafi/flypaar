import './globals.css'

export const metadata = {
  title: 'FlyPaar - Find Travel Companions for Your Loved Ones',
  description: 'Connect elderly parents and first-time travelers with trusted companions on the same flight. Free, open source, privacy first.',
  metadataBase: new URL('https://flypaar.com'),
  openGraph: {
    title: 'FlyPaar - Never Let Them Fly Alone',
    description: 'Find trusted travel companions for your elderly parents or first-time student travelers on the same flight.',
    url: 'https://flypaar.com',
    siteName: 'FlyPaar',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlyPaar - Never Let Them Fly Alone',
    description: 'Find trusted travel companions for your elderly parents or first-time student travelers on the same flight.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FAF6F1] text-[#222831]">
        <nav className="bg-white shadow-sm border-b border-[#DFD0B8]">
          <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" className="flex items-center space-x-2">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon fill="#E7EFC7" points="21.649,9 14.441,12.979 14.441,16.449 10.986,14.974 4,19.007 26,22.18"/>
                <path fill="#3B3B1A" d="M26,22.18V23L4,19.827v-0.82L26,22.18z M14.441,12.979v3.47L26,22.18L14.441,12.979z"/>
              </svg>
              <span className="text-xl font-bold text-black">FlyPaar</span>
            </a>
            <div className="flex items-center space-x-4 text-sm">
              <a href="/search" className="text-[#393E46] hover:text-black transition">
                Find Companion
              </a>
              <a
                href="/post"
                className="bg-[#3B3B1A] text-white px-4 py-2 rounded-lg hover:bg-[#222831] transition"
              >
                Post a Trip
              </a>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-white border-t border-[#DFD0B8] mt-auto">
          <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-[#393E46]">
            <p>
              <strong>FlyPaar</strong> — Connecting travelers with care.
              {' '}
              <a
                href="https://github.com/Ayybeeshafi/flypaar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#948979] hover:text-black underline"
              >
                Open Source
              </a>
            </p>
            <p className="mt-1 text-xs text-[#948979]">
              Your personal information is never shown publicly.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}