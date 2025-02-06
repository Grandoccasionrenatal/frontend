import Link from 'next/link';
import { Input } from '../ui/input';
import CONSTANTS from '@/constant';

type footerCategories = 'Company' | 'Customer' | 'More Links' | 'Contact' | 'Newsletter';

const footerLinks: Record<
  footerCategories,
  { title: string; link: string; isExternalLink?: boolean }[]
> = {
  'More Links': [
    {
      title: `Privacy Policy`,
      link: `/${CONSTANTS.ROUTES['privacy-policy']}`,
      isExternalLink: false
    },
    // {
    //   title: `Click & Collect`,
    //   link: `https://docs.google.com/document/d/1lE5QRQVFzBR776VbI9NtQApKIu2Tb9M_aRq_ESPm6gk/edit?usp=sharing`,
    //   isExternalLink: true
    // },
    // {
    //   title: `Cookies Policy`,
    //   link: `https://docs.google.com/document/d/1lE5QRQVFzBR776VbI9NtQApKIu2Tb9M_aRq_ESPm6gk/edit?usp=sharing`,
    //   isExternalLink: true
    // },
    {
      title: `Delivery Policy`,
      link: `/${CONSTANTS.ROUTES['delivery-policy']}`,
      isExternalLink: false
    },
    {
      title: `Returns Policy`,
      link: `/${CONSTANTS.ROUTES['returns-policy']}`,
      isExternalLink: false
    },
    {
      title: `Terms of Service`,
      link: `/${CONSTANTS.ROUTES['terms-of-service']}`,
      isExternalLink: false
    }
  ],
  Company: [{ title: `About`, link: `/about` }],
  Contact: [],
  Customer: [
    { title: `Products`, link: `/products` },
    { title: `Faq`, link: `/faq` },
    { title: `Blog`, link: `/` }
  ],
  Newsletter: []
};

const Footer = () => {
  return (
    <section className="relative w-full pt-12 pb-4 container">
      <div className="w-full bg-black-1 text-white font-sans rounded-custom min-h-[40vh] pt-[5rem] px-container-base lg:px-container-lg ">
        <div className="w-full grid grid-cols-1 gap-x-4 gap-y-12 md:grid-cols-3 xl:grid-cols-5 pb-6">
          {(['Company', 'Customer', 'More Links'] as footerCategories[])?.map((i, idx) => (
            <div key={idx} className="flex flex-col gap-[1rem]">
              <h5 className="font-[700]">{i}</h5>
              <div className="flex flex-col gap-[.5rem]">
                {footerLinks[i]?.map((i, idx) => (
                  <Link key={idx} href={i.link} target={i?.isExternalLink ? '_blank' : '_self'}>
                    <span className="text-[14px] text-white/70 hover:text-white transition-colors ease-in-out duration-300">
                      {i?.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-[1rem]">
            <h5 className="font-[700]">Contact</h5>
            <div className="flex flex-col gap-[.5rem]">
              <span className="text-[14px] text-white/70 transition-colors ease-in-out duration-300">
                Customer Service <br /> Open. Closes 8:00PM EST
              </span>
              <span className="text-[14px] text-white/70  transition-colors ease-in-out duration-300">
                Rental Delivery <br /> Open. Closes 8:00PM EST
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[14px] text-white/70  transition-colors ease-in-out duration-300">
                  Socials
                </span>
                <div className="flex items-center gap-4">
                  {(
                    [
                      {
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              className="fill-white/70 hover:fill-white group-hover:fill-white transition-colors ease-in-out duration-300"
                              d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"
                            />
                          </svg>
                        ),
                        link: 'https://www.facebook.com/'
                      },
                      {
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              className="fill-white/70 hover:fill-white group-hover:fill-white transition-colors ease-in-out duration-300"
                              d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                            />
                          </svg>
                        ),
                        link: 'https://www.instagram.com/'
                      },
                      {
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              className="fill-white/70 hover:fill-white group-hover:fill-white transition-colors ease-in-out duration-300"
                              d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"
                            />
                          </svg>
                        ),
                        link: 'https://wa.link/f1bp5f'
                      }
                    ] as { icon: JSX.Element; link: string }[]
                  )?.map((i, idx) => (
                    <Link key={idx} href={i?.link} target="_blank">
                      <span className="group h-max w-max">{i?.icon}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[1rem]">
            <h5 className="font-[700]">Newsletter</h5>
            <div className="flex flex-col gap-[.5rem]">
              <span className="text-[14px] text-white/70 transition-colors ease-in-out duration-300">
                Sign up to receive updates, <br />
                offers and other exclusive info via email
              </span>
              <div className="max-w-[15rem] p-1 flex gap-2 my-4 h-[2.75rem] rounded-[30px] border border-white">
                <div className="flex flex-grow overflow-hidden pl-2 !border-none focus-visible:border-none outline-none focus:ring-0 focus:border-none">
                  <Input className="w-full bg-transparent border-0 ring-0 focus:ring-0 focus-visible:ring-0 focus:border-0 text-white placeholder:text-white" />
                </div>
                <button className="min-w-[6rem] grid place-items-center h-full rounded-[30px] bg-white hover:bg-orange-1/90 transition-colors ease-in-out duration-300 text-black-1">
                  <span className="text-[12px]">Subscribe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full border-t border-t-white/30 py-8 flex items-center justify-center">
          <span className="text-[12px] text-white/70">
            Copyright © 2025 All rights reserved
          </span>
        </div>
      </div>
    </section>
  );
};

export default Footer;
