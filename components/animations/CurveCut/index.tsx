import { cn } from '@/lib/utils'
import React from 'react'

interface ICurveCut{
    containerClassName: string
    childClassName: string
}

const CurveCut = ({
    containerClassName,
    childClassName
}: ICurveCut) => {
  return (
    <div className={cn(`absolute bg-transparent `, containerClassName)}>
        <div className={cn(`absolute w-[23px] h-[50px] before:absolute before:h-[50px] before:w-[23px] before:bg-transparent before:rounded-br-[25px] before:shadow-[0_25px_0_0_white] `, childClassName)} />

        
    </div>
  )
}

export default CurveCut