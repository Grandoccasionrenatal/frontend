import NavBottomLine from '@/components/navBottomLine';
import ClientSection from '@/components/hocs/ClientSection';
import Link from 'next/link';

export const metadata = {
  title: 'Hire Packages — Grand Occasion Rental',
  description: 'Ready-made event hire packages for parties, celebrations, and corporate events across Kildare, Carlow, Kilkenny, Laois and surrounding counties.',
};

const packages = [
  {
    name: 'Party Starter',
    tagline: 'Perfect for small gatherings',
    guests: 'Up to 20 guests',
    price: 110,
    includes: [
      '20 x Folding Chairs',
      '2 x 5FT Round Tables',
      '2 x Table Linens',
    ],
    colour: 'bg-slate-50 border-slate-200',
    badge: '',
  },
  {
    name: 'Garden Gathering',
    tagline: 'Ideal for garden parties & communions',
    guests: 'Up to 40 guests',
    price: 265,
    includes: [
      '40 x Folding Chairs',
      '4 x 5FT Round Tables',
      '4 x Table Linens',
      'Delivery & Collection',
    ],
    colour: 'bg-orange-1/[0.04] border-orange-1/30',
    badge: 'Popular',
  },
  {
    name: 'Celebration',
    tagline: 'Great for birthdays, christenings & weddings',
    guests: 'Up to 80 guests',
    price: 820,
    includes: [
      '80 x Chiavari Chairs',
      '8 x 5FT Round Tables',
      '8 x Table Linens',
      'Delivery & Collection',
    ],
    colour: 'bg-slate-50 border-slate-200',
    badge: '',
  },
  {
    name: 'Premium Banquet',
    tagline: 'Ideal for large events & corporate functions',
    guests: 'Up to 150 guests',
    price: 1490,
    includes: [
      '150 x Chiavari Chairs',
      '15 x 5FT Round Tables',
      '15 x Table Linens',
      'Delivery & Collection',
    ],
    colour: 'bg-black-1 border-black-1',
    badge: 'Best Value',
    dark: true,
  },
];

export default function PackagesPage() {
  return (
    <main className="container h-full w-full flex flex-col">
      <NavBottomLine />

      {/* Hero */}
      <section className="py-14 px-container-base lg:px-nav-container-lg text-center">
        <span className="inline-block text-[12px] font-[700] uppercase tracking-widest text-orange-1 bg-orange-1/10 px-3 py-1 rounded-full mb-4">
          Hire Packages
        </span>
        <h1 className="text-[36px] md:text-[48px] font-[800] leading-tight mb-4">
          Everything you need,<br />bundled together
        </h1>
        <p className="text-[16px] text-black-1/60 max-w-xl mx-auto leading-[1.7]">
          Our ready-made packages take the stress out of planning. Pick a package, tell us your event date, and we'll handle the rest.
        </p>
      </section>

      {/* Packages grid */}
      <ClientSection
        id="packages"
        className="pb-16 px-container-base lg:px-nav-container-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative rounded-custom border p-8 flex flex-col gap-5 ${pkg.colour}`}
            >
              {pkg.badge && (
                <span className={`absolute top-5 right-5 text-[11px] font-[700] uppercase tracking-widest px-2.5 py-1 rounded-full ${pkg.dark ? 'bg-orange-1 text-white' : 'bg-orange-1 text-white'}`}>
                  {pkg.badge}
                </span>
              )}
              <div>
                <p className={`text-[12px] font-[600] uppercase tracking-widest mb-1 ${pkg.dark ? 'text-white/50' : 'text-black-1/40'}`}>{pkg.guests}</p>
                <h2 className={`text-[26px] font-[800] ${pkg.dark ? 'text-white' : 'text-black-1'}`}>{pkg.name}</h2>
                <p className={`text-[14px] mt-1 ${pkg.dark ? 'text-white/60' : 'text-black-1/50'}`}>{pkg.tagline}</p>
              </div>

              <ul className="flex flex-col gap-2">
                {pkg.includes.map((item) => (
                  <li key={item} className={`flex items-center gap-2 text-[14px] ${pkg.dark ? 'text-white/80' : 'text-black-1/70'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-orange-1 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-4 border-t border-current/10 flex items-end justify-between gap-4">
                <div>
                  <p className={`text-[12px] ${pkg.dark ? 'text-white/40' : 'text-black-1/40'}`}>From</p>
                  <p className={`text-[32px] font-[800] leading-none ${pkg.dark ? 'text-white' : 'text-black-1'}`}>
                    €{pkg.price}
                    <span className={`text-[13px] font-[400] ml-1 ${pkg.dark ? 'text-white/50' : 'text-black-1/50'}`}>incl. VAT</span>
                  </p>
                </div>
                <Link href={`/get-a-quote?package=${encodeURIComponent(pkg.name)}`}>
                  <button className={`h-[2.75rem] px-6 rounded-[23px] font-[700] text-[13px] transition-all ${pkg.dark ? 'bg-orange-1 text-white hover:opacity-90' : 'bg-black-1 text-white hover:bg-orange-1'}`}>
                    Get a Quote
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Custom package CTA */}
        <div className="mt-10 p-8 rounded-custom bg-orange-1/[0.06] border border-orange-1/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-[20px] font-[700] mb-1">Need something custom?</h3>
            <p className="text-[14px] text-black-1/60 leading-[1.6]">
              Don't see what you need? We build bespoke quotes for any event size — just tell us what you're planning and we'll put something together.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/get-a-quote">
              <button className="h-[2.5rem] px-5 rounded-[23px] bg-orange-1 text-white font-[700] text-[13px] hover:opacity-90 transition-opacity whitespace-nowrap">
                Request a Quote
              </button>
            </Link>
            <a href="tel:0851563498">
              <button className="h-[2.5rem] px-5 rounded-[23px] border border-black-1/20 font-[700] text-[13px] hover:bg-black-1/5 transition-colors whitespace-nowrap">
                Call Us
              </button>
            </a>
          </div>
        </div>
      </ClientSection>
    </main>
  );
}
