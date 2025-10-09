"use client"

import Image from "next/image"

export default function Logo() {
  return (
    <div className="flex items-center cursor-pointer ">
      
      <Image
        src="/pix-logo.png"
        alt="Pix Logo"
        width={25}
        height={25}
        className="mr-[2px] dark:invert-0 invert transition-all duration-300"
        priority
      />

      <span className="text-2xl font-bold">
        Pix
      </span>
    </div>
  )
}
