
"use client"

import { useState } from "react"

export function useConfetti(duration: number = 8000) {
  const [active, setActive] = useState(false)

  const trigger = () => {
    setActive(true)
    setTimeout(() => setActive(false), duration)
  }

  return { active, trigger }
}
