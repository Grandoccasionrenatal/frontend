import React from 'react';
import Link from 'next/link';

function HeroTitle() {
  return (
    <Link href={`/`}>
    <h3 className="text-[22px] sm:text-[32px] leading-[40px] font-giliran font-[700] ">
     Grand Occasion Rental<span className="text-[16px] font-sans text-start"> ™ </span>
    </h3>
  </Link>
  );
}

export default HeroTitle;
