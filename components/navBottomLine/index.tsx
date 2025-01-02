'use client'

import { useScroll } from "@/hooks/useScroll";
import { useMemo } from "react";
import { useScreen } from "usehooks-ts";

const NavBottomLine = () => {
    const { scrollY, setScrollY, scrollDirection } = useScroll();
    const screen = useScreen();

    const hideLine = useMemo(() => {
        const res = scrollY > 3
        return res
      }, [screen?.height, scrollY]);

  return (
    <div className={`w-full h-[calc(4rem+4px)] border-b border-b-slate-300 transition-opacity duration-300 ease-in-out ${hideLine ? `opacity-0` : `opacity-100`}`} />

  )
}

export default NavBottomLine