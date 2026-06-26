import CommonHero from '@/components/commonHero';
import ClientSection from '@/components/hocs/ClientSection';
import NavBottomLine from '@/components/navBottomLine';
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

const FAQ_SECTIONS = [
  {
    category: 'Booking & Reservations',
    items: [
      {
        question: 'How do I make a booking?',
        answer:
          'You can book in three ways: (1) Add items to your cart on our website and proceed to checkout for online payment, (2) Use our Send Booking Enquiry form to request a quote and we will contact you within 24 hours, or (3) Call or WhatsApp us on 085 156 3498. We recommend booking as early as possible — popular items like marquees and bouncy castles fill up quickly, especially during summer weekends.'
      },
      {
        question: 'How far in advance should I book?',
        answer:
          'We recommend booking at least 2–4 weeks in advance for standard hire items, and 4–8 weeks for marquee packages or large events. For summer weekends (June–August) and school holiday periods, earlier is always better. Last-minute bookings are accepted subject to availability — give us a call and we will do our best.'
      },
      {
        question: 'What areas do you deliver to?',
        answer:
          'We cover Co. Kildare, Co. Carlow, Co. Laois, Co. Wicklow, Co. Dublin, and surrounding counties. Delivery charges vary based on distance from our depot in Kildare. Enter your address at checkout to see the exact delivery cost, or contact us for a quote.'
      },
      {
        question: 'Can I collect equipment myself instead of having it delivered?',
        answer:
          'Yes, collection is available from our depot in Kildare. Please contact us to arrange a collection time so we can have your order ready. Note that marquees and large items require delivery and professional setup by our team.'
      },
      {
        question: 'Can I change or add items after I have confirmed my booking?',
        answer:
          'Yes, we will do our best to accommodate changes. Contact us as soon as possible — changes are easier to make the earlier they are requested. During peak season, availability of additional items cannot be guaranteed.'
      }
    ]
  },
  {
    category: 'Payments & Deposits',
    items: [
      {
        question: 'What deposit do you require?',
        answer:
          'A 30% non-refundable booking deposit is required to secure your date and equipment. The remaining balance is due before or on the day of delivery. Online bookings via our website are processed through Stripe — your card details are fully secure.'
      },
      {
        question: 'Is the deposit refundable?',
        answer:
          'The 30% booking deposit is non-refundable. It covers the cost of reserving your equipment and turning away other bookings for your date. Please see our Cancellation Policy for full details on refunds in different circumstances.'
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept all major credit and debit cards (Visa, Mastercard) via our secure online checkout powered by Stripe. Bank transfer is also accepted — contact us for bank details. Cash payments can be arranged on collection or delivery.'
      },
      {
        question: 'Is there a damage deposit on top of the rental fee?',
        answer:
          'For standard hire items (chairs, tables, linen), no separate damage deposit is required. For marquees and premium items, a refundable security deposit may be required — this will be clearly stated at booking. The deposit is returned within 5 business days after the safe return of all equipment.'
      }
    ]
  },
  {
    category: 'Delivery, Setup & Collection',
    items: [
      {
        question: 'Do you set up and take down the equipment?',
        answer:
          'Yes. For marquees, we provide full setup and takedown as part of the package — our team will erect and dismantle the marquee at agreed times. For smaller items like chairs, tables, and soft play, delivery includes offloading at your venue. Setup assistance is available for an additional fee — just ask when booking.'
      },
      {
        question: 'How long does marquee setup take?',
        answer:
          'Setup time depends on the marquee size and extras. A standard 4x6m marquee typically takes 1.5–2 hours. Larger marquees (5x10m and above) or packages with flooring, draping, and furniture can take 3–5 hours. We will agree a setup time with you in advance so you can plan your day.'
      },
      {
        question: 'When do you deliver and collect?',
        answer:
          'Delivery and collection times are agreed at booking. We typically deliver the day before or the morning of your event, and collect the day after or the evening of your event. We will always call ahead to confirm a time window. If you need a specific time, please let us know and we will do our best to accommodate you.'
      },
      {
        question: 'What access does the delivery team need?',
        answer:
          'Our team needs clear vehicle access to your venue or garden. For marquees, we need a reasonably level, clear area of ground — free from overhanging trees, power lines, or underground cables. Please let us know of any access restrictions (narrow lanes, low gates, steps) when booking so we can plan accordingly.'
      },
      {
        question: 'Do you deliver on weekends and bank holidays?',
        answer:
          'Yes, we deliver seven days a week including weekends and bank holidays, as most events take place on these days. Weekend and bank holiday deliveries are subject to availability — early booking is strongly recommended.'
      }
    ]
  },
  {
    category: 'Marquees & Packages',
    items: [
      {
        question: 'What sizes of marquee do you have?',
        answer:
          'We offer marquees from 3x6m up to 5x10m. Our most popular sizes are the 4x6m (seats approx. 25 guests) and 4x8m (seats approx. 36 guests). All marquees come with a heater and lighting as standard. See our Marquee Packages on the Products page for full details and pricing.'
      },
      {
        question: 'What is included in a marquee package?',
        answer:
          'Our marquee packages include the marquee frame and cover, your choice of chairs (folding or Chiavari with cushion), trestle and/or round tables, Spandex table covers, heater, and lighting. Optional extras include artificial grass flooring, draping, flower centrepieces, candy cart, bouncy castle, and more. Prices are fully inclusive of VAT.'
      },
      {
        question: 'Can I add extras to my marquee package?',
        answer:
          'Absolutely. Popular add-ons include artificial grass flooring (from €70), draping (from €220), Spandex chair covers (€1.50 each), flower centrepieces (€19.99), candy cart with jars (€85), bouncy castle (from €120), and luxury softplay set (from €350). Contact us to build a custom quote.'
      },
      {
        question: 'Is the marquee suitable for use in bad weather?',
        answer:
          'Our marquees are designed for Irish weather and are waterproof and wind-resistant under normal conditions. Each package includes a heater so your guests stay comfortable. In the event of severe weather warnings (Storm Status Orange or Red), we may need to postpone setup for safety — please see our Cancellation Policy for weather-related terms.'
      },
      {
        question: 'Do I need planning permission for a marquee?',
        answer:
          'For private residential use (garden parties, family events), planning permission is not usually required for a temporary marquee. For commercial use or events on public land, you may need to check with your local council. We recommend confirming with Kildare County Council or your relevant local authority if you are unsure.'
      }
    ]
  },
  {
    category: 'Damage, Cancellations & Policies',
    items: [
      {
        question: 'What happens if equipment is damaged?',
        answer:
          'We understand that minor wear and tear can occur during events. However, significant damage — broken chairs, torn linen, damaged marquee panels — will be charged at the cost of repair or replacement. We will always discuss any damage with you before making any charge. Taking care of hired equipment is the responsibility of the hirer for the duration of the rental period.'
      },
      {
        question: 'What is your cancellation policy?',
        answer:
          'The 30% booking deposit is non-refundable in all cases. For cancellations made more than 14 days before the event, no further charge applies. For cancellations within 14 days, up to 50% of the remaining balance may be charged. For cancellations within 48 hours, the full balance may be charged. See our full Cancellation Policy page for details.'
      },
      {
        question: 'Can I reschedule my booking?',
        answer:
          'Yes, rescheduling is possible subject to availability. If you reschedule with at least 7 days notice, your deposit can be transferred to a new date at no extra charge (one reschedule only). Contact us as soon as possible if your plans change.'
      },
      {
        question: 'What if my event is cancelled due to bad weather?',
        answer:
          'We do not issue refunds for weather conditions unless an official Met Eireann Status Orange or Red weather warning is in place for your county on the day of your event. In that case, we will work with you to reschedule at no extra charge. Please see our full Cancellation Policy for details.'
      }
    ]
  },
  {
    category: 'General',
    items: [
      {
        question: 'Where are you based?',
        answer:
          'We are based in Co. Kildare, Ireland. We serve Kildare, Carlow, Laois, Wicklow, Dublin, and surrounding counties. Call us on 085 156 3498 or email info@grandoccasionrental.ie.'
      },
      {
        question: 'Is your equipment insured?',
        answer:
          'Yes, our equipment is covered by our own insurance policy. However, the hirer is responsible for the equipment during the rental period. We strongly recommend checking your home insurance or event insurance policy if you are concerned about accidental damage cover.'
      },
      {
        question: 'Is your soft play and bouncy castle equipment safe?',
        answer:
          'Yes. All our soft play and bouncy castle equipment is regularly inspected, cleaned, and maintained to the highest safety standards. Our equipment meets Irish and EU safety guidelines. Adult supervision is required at all times when children are using play equipment.'
      },
      {
        question: 'I cannot find the item I need on your website — can you still help?',
        answer:
          'Possibly! Our website does not always reflect our full inventory. Contact us on 085 156 3498 or at info@grandoccasionrental.ie and we will let you know if we can source the item or point you in the right direction.'
      },
      {
        question: 'How do I contact you?',
        answer:
          'Phone / WhatsApp: 085 156 3498 | Email: info@grandoccasionrental.ie | Website: www.grandoccasionrental.ie. We are available Monday to Sunday and aim to respond to all enquiries within 24 hours.'
      }
    ]
  }
];

const Faq = () => {
  return (
    <main className="container h-full w-full flex flex-col">
      <NavBottomLine />
      <section className="relative w-full py-12">
        <CommonHero
          description="Everything you need to know about hiring from Grand Occasion Rental. Can't find your answer? Call us on 085 156 3498."
          image="https://plus.unsplash.com/premium_photo-1661631018149-a0268211bbd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          linkedSection="browse-faq"
          tag={'Frequently Asked Questions'}
          title="How Can We Help?"
          className=""
        />
      </section>
      <ClientSection
        id="browse-faq"
        className="py-12 mb-12 px-container-base lg:px-nav-container-lg rounded-custom"
      >
        <div className="w-full flex flex-col gap-12">
          {FAQ_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="w-full flex flex-col gap-2">
              <h4 className="text-[20px] font-[700] text-orange-1 border-b border-orange-1/30 pb-2 mb-2">
                {section.category}
              </h4>
              <Accordion type="single" collapsible className="w-full">
                {section.items.map((item, iIdx) => (
                  <AccordionItem key={iIdx} value={`${sIdx}-${iIdx}`}>
                    <AccordionTrigger className="no-underline text-start hover:no-underline font-[600] text-[15px]">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[15px] leading-[1.7] text-black-1/80">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          <div className="w-full mt-4 p-6 rounded-custom bg-orange-1/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h5 className="text-[18px] font-[700] mb-1">Still have a question?</h5>
              <p className="text-[14px] text-black-1/70">
                Our team is happy to help — get in touch and we will get back to you within 24 hours.
              </p>
            </div>
            <Link href="/contact">
              <button className="w-max h-[2.75rem] px-6 rounded-[23px] bg-orange-1 text-white font-[600] text-[14px] hover:opacity-90 transition-opacity ease-in-out duration-300 whitespace-nowrap">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </ClientSection>
    </main>
  );
};

export default Faq;
