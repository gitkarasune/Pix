"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

export default function Logo() {
  return (
    <div className={cn("flex items-center ")}>
      {/* <div
      className="relative flex h-2 w-2 dark:bg-white bg-black text-white dark:text-black items-center justify-center rounded-full"
      > 
      </div> */}
      <Image
        src="/pix-logo-white.png"
        alt="Pix Logo"
        width={24}
        height={24}
        className="ml-2 dark:invert"
        priority
      />

      <span className="text-xl font-bold">
        Pix
      </span>
    </div>
  )
}
