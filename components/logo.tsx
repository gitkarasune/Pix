"use client"

import { cn } from "@/lib/utils"

export default function Logo() {
  return (
    <div className={cn("flex items-center ")}>
      <div
      className="relative flex h-2 w-2 dark:bg-white bg-black text-white dark:text-black items-center justify-center rounded-full"
      >
        
      </div>
      <span className="text-xl font-bold">
        Pix
      </span>
    </div>
  )
}
