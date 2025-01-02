'use client'

import { cn } from "@/lib/utils"

interface IClientSection{
    id?: string
    children?: React.ReactNode
    className?: string
}

const ClientSection = ({
    className,
    id,
    children
}: IClientSection) => {
  return (
   <section id={id} className={cn('w-full relative', className)}>
    {children}
   </section>
  )
}

export default ClientSection