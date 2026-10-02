import './globals.css'

export const metadata = {
  title: 'Setuju — Social Media & Branding Agency',
  description: 'We make brands worth following. Strategy, content & social media management for brands that want to stay relevant — Branding Solution Partner for business, especially UMKM.',
  openGraph: {
    title: 'Setuju — Social Media & Branding Agency',
    description: 'We make brands worth following. Branding Solution Partner for business, especially UMKM.',
    type: 'website'
  }
}

export const viewport = { themeColor: '#f6f4ee' }

export default function RootLayout({children}) {
  return <html lang="en"><body>{children}</body></html>
}
