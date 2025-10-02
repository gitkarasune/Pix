"use client"

import { useUser } from "@clerk/nextjs"
import { useCallback } from "react"

/**
 * A safe localStorage wrapper that automatically scopes data to the current user.
 * Example: user_123-favorites instead of just "favorites".
 */
export function useUserStorage() {
  const { user } = useUser()
  const userId = user?.id || "guest"

  // build scoped key
  const getKey = useCallback(
    (baseKey: string) => `${userId}-${baseKey}`,
    [userId]
  )

  // read value
  const getItem = useCallback(
    (key: string): string | null => {
      if (typeof window === "undefined") return null
      return localStorage.getItem(getKey(key))
    },
    [getKey]
  )

  // save value
  const setItem = useCallback(
    (key: string, value: any) => {
      if (typeof window === "undefined") return
      localStorage.setItem(getKey(key), JSON.stringify(value))
    },
    [getKey]
  )

  // remove value
  const removeItem = useCallback(
    (key: string) => {
      if (typeof window === "undefined") return
      localStorage.removeItem(getKey(key))
    },
    [getKey]
  )

  return { getItem, setItem, removeItem, getKey }
}
