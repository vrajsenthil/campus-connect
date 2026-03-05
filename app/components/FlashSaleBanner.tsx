import Link from 'next/link'

export default function FlashSaleBanner() {
  return (
    <div className="bg-amber-500 text-amber-950 py-2.5 px-4 text-center text-sm font-semibold">
      <span className="mr-2">🔥 Flash sale:</span>
      <span>Round trip only $25 — Purdue ↔ UIUC. March 6–8.</span>
      <Link
        href="/booking"
        className="ml-2 underline font-bold hover:text-amber-900"
      >
        Book now →
      </Link>
    </div>
  )
}
