import CommonHero from '@/components/commonHero';
import ClientSection from '@/components/hocs/ClientSection';
import NavBottomLine from '@/components/navBottomLine';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

const Faq = () => {
  return (
    <main className="container h-full w-full flex flex-col">
      <NavBottomLine />
      <section className="relative w-full py-12">
        <CommonHero
          description="Browse through our catalogue of frequntly asked questions, feel free to contact
         us for further assistance and clarification"
          image="https://plus.unsplash.com/premium_photo-1661631018149-a0268211bbd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          linkedSection="browse-faq"
          tag={'Well Documented FAQs'}
          title="Frequently Asked Questions"
          className=""
        />
      </section>
      <ClientSection
        id="browse-faq"
        className="py-12 mb-12 px-container-base lg:px-nav-container-lg rounded-custom "
      >
        <div id="browse" className="w-full flex flex-col gap-4">
          <h4 className="text-center text-[32px] font-[700] mb-4">Browse Through Our FAQs</h4>
          <div className="w-full flex flex-col items-center justify-center font-sans">
            {(
              [
                {
                  question: `What is Grand Occasion Rental?`,
                  answer: `Grand Occasion Rental is a family-run event equipment hire business located in Athy, Co. Kildare, Ireland. We provide a wide range of high-quality event equipment and accessories for various occasions.`
                },
                {
                  question: `What types of events do you cater to?`,
                  answer: `We cater to a diverse range of events, including but not limited to weddings, corporate gatherings, birthdays, anniversaries, and community events.
              `
                },
                {
                  question: `What equipment do you offer for rent?`,
                  answer: `Our inventory includes tables, chairs, linens, dinnerware, glassware, marquees, lighting, dance floors, and more. We also offer soft playground equipment for children's events.
            `
                },
                {
                  question: `Do you provide delivery and pickup services?`,
                  answer: `Yes, we offer convenient delivery and pickup services to ensure a hassle-free experience for our customers. Please inquire about the delivery charges based on your location.
          `
                },
                {
                  question: `Do you offer setup and takedown services?`,
                  answer: `Yes, we offer setup and takedown services for an additional fee. Our team can efficiently set up and arrange the rented equipment according to your specifications
        `
                },
                {
                  question: `Can I view your equipment before renting?`,
                  answer: `Absolutely! We encourage you to visit our showroom to see our equipment in person. This helps you make informed decisions about the items you'd like to rent for your event.`
                },
                {
                  question: `How can I make a reservation?`,
                  answer: `You can make a reservation by contacting us via, our website at www.grandoccasionrental.ie, phone us on 0851563498 or email us at info@grandoccasionrental.ie Our team will guide you through the rental booking process and provide you with all the necessary information.`
                },
                {
                  question: `What is the rental duration?`,
                  answer: `Our standard rental period is usually 24 to 48 hours. If you need an extended rental period, please let us know, and we'll do our best to accommodate your needs.`
                },
                {
                  question: `Is a security deposit required?`,
                  answer: `Yes, a security deposit is required for all rentals. This deposit is refundable upon the return of the rented items in good condition.`
                },
                {
                  question: `What happens if rented items get damaged?`,
                  answer: `We understand that minor wear and tear can occur. However, significant damage may result in a deduction from your security deposit. We recommend reviewing our rental agreement for more details.`
                },
                {
                  question: `Can I make changes to my rental order after it's confirmed?`,
                  answer: `We understand that plans can change. While we'll do our best to accommodate changes, we recommend finalizing your rental order as early as possible to ensure availability.
`
                },
                {
                  question: `Can I cancel a reservation?`,
                  answer: `Yes, you can cancel a reservation. However, please note that our cancellation policy applies. It's best to contact us as soon as possible to discuss any changes or cancellations.
`
                },
                {
                  question: `How far in advance should I make a reservation?`,
                  answer: `We recommend making a reservation as early as possible to secure the equipment you need for your event. Some items may be in high demand during certain seasons, so early booking is advisable.
`
                },
                {
                  question: `Can I rent outdoor furniture for personal use?`,
                  answer: `Absolutely! In addition to event rentals, we offer stylish outdoor furniture that's perfect for enhancing your home spaces.

  `
                },
                {
                  question: `If you have any more questions or need further assistance...`,
                  answer: `Feel free to contact us at info@grandoccasionrental.ie. We're here to make your event planning experience smooth and enjoyable!`
                }
              ] as { question: string; answer: string }[]
            )?.map((i, idx) => (
              <Accordion key={idx} className="w-full max-w-[50rem]" type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="no-underline text-start hover:no-underline">
                    {i?.question}
                  </AccordionTrigger>
                  <AccordionContent>{i?.answer}</AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </ClientSection>
    </main>
  );
};

export default Faq;
