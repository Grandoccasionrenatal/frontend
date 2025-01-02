import CommonHero from '@/components/commonHero';
import ClientSection from '@/components/hocs/ClientSection';
import NavBottomLine from '@/components/navBottomLine';

const About = () => {
  return (
    <main className="container h-full w-full flex flex-col">
      <NavBottomLine />
      <section className="relative w-full py-12">
        <CommonHero
          description="Grand Occassion rental, no 4, skrill district, Ireland."
          image="https://plus.unsplash.com/premium_photo-1661631018149-a0268211bbd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          linkedSection="about-us"
          tag={'Top Rental Service'}
          title="Your Favourite Event Rental Platform"
          className=""
        />
      </section>
      <ClientSection
        id="about-us"
        className="py-12 mb-12 px-container-base lg:px-nav-container-lg rounded-custom bg-orange-1/[0.05]"
      >
        <div className="w-full flex flex-col gap-4">
          <h4 className="text-start text-[32px] font-[700] mb-4">About Us</h4>
          <div className="w-full flex flex-col gap-2 font-sans">
            <p>
              Welcome to Grand Occasion Rental! Established in July 2023, we’re a family-run event
              equipment hire business in Athy, Co. Kildare. With delivery and pickup services, we’re
              your convenient choice for making events shine. Run by a dedicated family team, our
              goal is to elevate your events. Whether it’s an intimate get-together or a lively
              celebration, we provide premium equipment that fits. Plus, we offer stylish outdoor
              furniture to add flair to your home.
            </p>
            <p>
              Focused on small and medium-sized events, we’re here to grow with you. Our aim is to
              become your go-to for all things event-related.
            </p>
            <p>
              We know that every moment matters, even for the littlest attendees. That’s why we’re
              proud to supply soft playground equipment for children’s events, ensuring fun and
              safety. At Grand Occasion Rental, we’re all about exceptional service and top-notch
              equipment to create unforgettable events. Thank you for letting us be part of your
              grand occasions.
            </p>
          </div>
        </div>
      </ClientSection>
    </main>
  );
};

export default About;
