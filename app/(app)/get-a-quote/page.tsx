import NavBottomLine from '@/components/navBottomLine';
import QuoteForm from './QuoteForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get a Free Quote | Grand Occasion Rental — Marquee & Event Hire Kildare',
  description:
    'Request a free, no-obligation quote for marquee hire, tables, chairs, bouncy castles and more across Kildare, Dublin, Carlow and Laois. We respond within a few hours.',
  alternates: { canonical: 'https://www.grandoccasionrental.ie/get-a-quote' }
};

export default function GetAQuotePage() {
  return (
    <main className="container w-full flex flex-col">
      <NavBottomLine />
      <section className="w-full max-w-2xl mx-auto py-12 px-4">
        <div className="mb-8">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Free &amp; No Obligation</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-3">Get a Quote</h1>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            Tell us a little about your event and we&apos;ll get back to you within a few hours with availability and pricing. No pressure, no commitment.
          </p>
        </div>
        <QuoteForm />
        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-orange-500 shrink-0">
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
            </svg>
            <span>Or call / WhatsApp: <a href="tel:0851563498" className="text-orange-500 font-medium">085 156 3498</a></span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-orange-500 shrink-0">
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
            <span>Email: <a href="mailto:info@grandoccasionrental.ie" className="text-orange-500 font-medium">info@grandoccasionrental.ie</a></span>
          </div>
        </div>
      </section>
    </main>
  );
}
