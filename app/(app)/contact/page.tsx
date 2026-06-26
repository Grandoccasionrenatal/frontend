import CommonHero from '@/components/commonHero';
import ClientSection from '@/components/hocs/ClientSection';
import NavBottomLine from '@/components/navBottomLine';
import Link from 'next/link';

const Contact = () => {
  return (
    <main className="container h-full w-full flex flex-col">
      <NavBottomLine />
      <section className="relative w-full py-12">
        <CommonHero
          description="We are happy to help with any questions about our hire packages, delivery, or bookings. Get in touch and we will get back to you within 24 hours."
          image="https://plus.unsplash.com/premium_photo-1661631018149-a0268211bbd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          linkedSection="contact-details"
          tag={'Get In Touch'}
          title="Contact Us"
          className=""
        />
      </section>
      <ClientSection
        id="contact-details"
        className="py-12 mb-12 px-container-base lg:px-nav-container-lg rounded-custom"
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[28px] font-[700]">Get In Touch</h4>
            <p className="text-[15px] text-black-1/70 leading-[1.7]">
              Whether you want to enquire about a specific hire package, check availability for your
              event date, or need help placing an order — we are here to help.
            </p>

            <div className="flex flex-col gap-4 font-sans">
              {/* Phone */}
              <div className="flex items-start gap-4 p-4 rounded-custom bg-orange-1/[0.06] border border-orange-1/20">
                <div className="w-10 h-10 rounded-full bg-orange-1 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] text-black-1/50 mb-1">Phone / WhatsApp</p>
                  <a href="tel:0851563498" className="text-[17px] font-[700] hover:text-orange-1 transition-colors">
                    085 156 3498
                  </a>
                  <p className="text-[12px] text-black-1/50 mt-1">Monday – Sunday, 9am – 8pm</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-4 rounded-custom bg-orange-1/[0.06] border border-orange-1/20">
                <div className="w-10 h-10 rounded-full bg-orange-1 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] text-black-1/50 mb-1">Email</p>
                  <a href="mailto:info@grandoccasionrental.ie" className="text-[17px] font-[700] hover:text-orange-1 transition-colors">
                    info@grandoccasionrental.ie
                  </a>
                  <p className="text-[12px] text-black-1/50 mt-1">We reply within 24 hours</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 p-4 rounded-custom bg-orange-1/[0.06] border border-orange-1/20">
                <div className="w-10 h-10 rounded-full bg-orange-1 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] text-black-1/50 mb-1">Based In</p>
                  <p className="text-[17px] font-[700]">Co. Kildare, Ireland</p>
                  <p className="text-[12px] text-black-1/50 mt-1">Serving Kildare · Carlow · Dublin · Laois · Wicklow</p>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start gap-4 p-4 rounded-custom bg-orange-1/[0.06] border border-orange-1/20">
                <div className="w-10 h-10 rounded-full bg-orange-1 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] text-black-1/50 mb-1">Instagram</p>
                  <a href="https://www.instagram.com/grandoccasionrental" target="_blank" rel="noopener noreferrer" className="text-[17px] font-[700] hover:text-orange-1 transition-colors">
                    @grandoccasionrental
                  </a>
                  <p className="text-[12px] text-black-1/50 mt-1">See our latest packages and setups</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick links & CTA */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[28px] font-[700]">Quick Links</h4>
            <p className="text-[15px] text-black-1/70 leading-[1.7]">
              Looking for something specific? These pages might help.
            </p>
            <div className="grid grid-cols-1 gap-3 font-sans">
              {[
                { label: 'Browse All Hire Products', href: '/products', desc: 'Marquees, chairs, tables, soft play and more' },
                { label: 'Send a Booking Enquiry', href: '/offline-order', desc: 'Not ready to pay online? Send us your requirements' },
                { label: 'Frequently Asked Questions', href: '/faq', desc: 'Answers to our most common questions' },
                { label: 'Cancellation Policy', href: '/cancellation-policy', desc: 'Our deposit, refund and rescheduling terms' },
              ].map((link, idx) => (
                <Link key={idx} href={link.href}>
                  <div className="flex items-center justify-between p-4 rounded-custom border border-slate-200 hover:border-orange-1/50 hover:bg-orange-1/[0.04] transition-colors ease-in-out duration-200 group">
                    <div>
                      <p className="text-[15px] font-[600] group-hover:text-orange-1 transition-colors">{link.label}</p>
                      <p className="text-[12px] text-black-1/50 mt-0.5">{link.desc}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-black-1/30 group-hover:text-orange-1 group-hover:translate-x-1 transition-all">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-2 p-6 rounded-custom bg-black-1 text-white flex flex-col gap-3">
              <h5 className="text-[18px] font-[700]">Ready to book?</h5>
              <p className="text-[14px] text-white/70 leading-[1.6]">
                Add items to your cart and checkout online, or call us and we will take your booking over the phone.
              </p>
              <div className="flex flex-wrap gap-3 mt-1">
                <Link href="/products">
                  <button className="h-[2.5rem] px-5 rounded-[23px] bg-orange-1 text-white font-[600] text-[13px] hover:opacity-90 transition-opacity">
                    Browse Products
                  </button>
                </Link>
                <a href="tel:0851563498">
                  <button className="h-[2.5rem] px-5 rounded-[23px] border border-white/30 text-white font-[600] text-[13px] hover:bg-white/10 transition-colors">
                    Call 085 156 3498
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </ClientSection>
    </main>
  );
};

export default Contact;
