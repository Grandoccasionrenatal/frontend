import NavBottomLine from '@/components/navBottomLine';
import ClientSection from '@/components/hocs/ClientSection';
import Link from 'next/link';

export const metadata = {
  title: 'Corporate Hire — Grand Occasion Rental',
  description: 'Professional furniture and equipment hire for corporate events, conferences, and meetings across Kildare, Carlow, Kilkenny, Laois and surrounding counties.',
};

const benefits = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    title: 'Delivery & Collection',
    desc: 'We deliver, set up, and collect — so your team can focus on running the event.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    title: 'Bespoke Quotations',
    desc: 'Every corporate event is different. We provide detailed, itemised quotes tailored to your brief.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
    title: 'Professional Setup',
    desc: 'Clean, well-maintained equipment presented to a professional standard every time.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
      </svg>
    ),
    title: 'Repeat Booking Discounts',
    desc: 'Regular clients and event companies benefit from preferential pricing on repeat bookings.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Flexible Scheduling',
    desc: 'We work around your event timetable — including early morning setups and late collections.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    title: 'Dedicated Point of Contact',
    desc: 'One person to call — no call centres, no hold music. We pick up and get things done.',
  },
];

const suitableFor = [
  'Conference & meeting venues',
  'Corporate away days',
  'Company celebration dinners',
  'Hotel overflow furniture',
  'Government & public sector events',
  'Event management companies',
  'Wedding planners & stylists',
  'Community & charity events',
];

export default function CorporatePage() {
  return (
    <main className="container h-full w-full flex flex-col">
      <NavBottomLine />

      {/* Hero */}
      <section className="py-14 px-container-base lg:px-nav-container-lg">
        <div className="max-w-3xl">
          <span className="inline-block text-[12px] font-[700] uppercase tracking-widest text-orange-1 bg-orange-1/10 px-3 py-1 rounded-full mb-4">
            Corporate Hire
          </span>
          <h1 className="text-[36px] md:text-[52px] font-[800] leading-tight mb-5">
            Professional event hire<br />for businesses & planners
          </h1>
          <p className="text-[16px] text-black-1/60 leading-[1.8] max-w-2xl mb-8">
            From intimate boardroom lunches to large-scale conferences, we supply premium furniture and equipment to businesses, event companies, hotels, and public sector organisations across Leinster.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="#enquiry">
              <button className="h-[2.75rem] px-6 rounded-[23px] bg-orange-1 text-white font-[700] text-[14px] hover:opacity-90 transition-opacity">
                Send a Corporate Enquiry
              </button>
            </Link>
            <a href="tel:0851563498">
              <button className="h-[2.75rem] px-6 rounded-[23px] border border-black-1/20 font-[700] text-[14px] hover:bg-black-1/5 transition-colors">
                Call 085 156 3498
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <ClientSection
        id="why-us"
        className="py-14 px-container-base lg:px-nav-container-lg bg-slate-50 rounded-custom mx-4 mb-8"
      >
        <h2 className="text-[28px] font-[800] mb-2">Why businesses choose us</h2>
        <p className="text-[15px] text-black-1/50 mb-10">Reliable, professional, and easy to work with.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-orange-1/10 text-orange-1 flex items-center justify-center shrink-0">
                {b.icon}
              </div>
              <div>
                <p className="text-[15px] font-[700] mb-1">{b.title}</p>
                <p className="text-[13px] text-black-1/55 leading-[1.6]">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </ClientSection>

      {/* Suitable for */}
      <ClientSection
        id="suitable-for"
        className="py-14 px-container-base lg:px-nav-container-lg mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-[28px] font-[800] mb-2">Who we work with</h2>
            <p className="text-[15px] text-black-1/50 mb-8">
              We partner with a wide range of organisations — from one-off events to ongoing supply agreements.
            </p>
            <ul className="grid grid-cols-1 gap-3">
              {suitableFor.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[14px] text-black-1/70">
                  <span className="w-2 h-2 rounded-full bg-orange-1 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-black-1 rounded-custom p-8 text-white flex flex-col gap-5">
            <h3 className="text-[22px] font-[800]">What we supply</h3>
            <p className="text-[14px] text-white/60 leading-[1.6]">
              Our full range is available for corporate hire, including:
            </p>
            {[
              ['Seating', 'Chiavari chairs, folding chairs, throne chairs, benches'],
              ['Tables', 'Round tables (5ft), trestle tables (6ft), high-rise tables'],
              ['Linens', 'Table cloths and covers in a range of colours'],
              ['Tableware', 'Plates, cutlery, glasses'],
              ['Accessories', 'Garment rails, centrepieces, soft play equipment'],
            ].map(([cat, desc]) => (
              <div key={cat} className="border-t border-white/10 pt-4">
                <p className="text-[13px] font-[700] text-orange-1 mb-0.5">{cat}</p>
                <p className="text-[13px] text-white/60">{desc}</p>
              </div>
            ))}
            <Link href="/products">
              <button className="mt-2 h-[2.5rem] px-5 rounded-[23px] border border-white/20 text-white font-[600] text-[13px] hover:bg-white/10 transition-colors w-full">
                Browse Full Catalogue
              </button>
            </Link>
          </div>
        </div>
      </ClientSection>

      {/* Enquiry form */}
      <ClientSection
        id="enquiry"
        className="py-14 px-container-base lg:px-nav-container-lg mb-14 bg-orange-1/[0.04] rounded-custom mx-4"
      >
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-[28px] font-[800] mb-2">Send a Corporate Enquiry</h2>
          <p className="text-[15px] text-black-1/55 leading-[1.7]">
            Tell us about your event and we'll come back with a detailed quote within 24 hours.
          </p>
        </div>
        <form
          action="https://formsubmit.co/info@grandoccasionrental.ie"
          method="POST"
          className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input type="hidden" name="_subject" value="New Corporate Hire Enquiry — Grand Occasion Rental" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-[600] text-black-1/60">Your Name *</label>
            <input required name="name" type="text" placeholder="Jane Smith"
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-1/40 bg-white" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-[600] text-black-1/60">Company / Organisation *</label>
            <input required name="company" type="text" placeholder="Acme Events Ltd"
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-1/40 bg-white" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-[600] text-black-1/60">Email Address *</label>
            <input required name="email" type="email" placeholder="jane@company.com"
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-1/40 bg-white" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-[600] text-black-1/60">Phone Number</label>
            <input name="phone" type="tel" placeholder="085 000 0000"
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-1/40 bg-white" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-[600] text-black-1/60">Event Date *</label>
            <input required name="event_date" type="date"
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-1/40 bg-white" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-[600] text-black-1/60">Venue / Location *</label>
            <input required name="venue" type="text" placeholder="Carlow, Co. Carlow"
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-1/40 bg-white" />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[13px] font-[600] text-black-1/60">What do you need? *</label>
            <textarea required name="requirements" rows={4}
              placeholder="e.g. 100 chairs, 10 round tables, linens, delivery and setup..."
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-1/40 bg-white resize-none" />
          </div>
          <div className="md:col-span-2">
            <button type="submit"
              className="w-full h-[3rem] rounded-[23px] bg-orange-1 text-white font-[700] text-[14px] hover:opacity-90 transition-opacity">
              Send Enquiry
            </button>
            <p className="text-center text-[12px] text-black-1/40 mt-3">We reply within 24 hours — usually much sooner.</p>
          </div>
        </form>
      </ClientSection>
    </main>
  );
}
