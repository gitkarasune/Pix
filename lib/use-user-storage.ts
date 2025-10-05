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
      try {
        return localStorage.getItem(getKey(key))
      } catch {
        return null
      }
    },
    [getKey]
  )

  // save value
  const setItem = useCallback(
    (key: string, value: unknown) => {
      if (typeof window === "undefined") return
      try {
        localStorage.setItem(getKey(key), JSON.stringify(value))
      } catch (err) {
        console.error("Error saving to loalstorage:", err)
      }
    },
    [getKey]
  )

  // remove value
  const removeItem = useCallback(
    (key: string) => {
      if (typeof window === "undefined") return
      // Don't allow profile data to be removed
      if (["profile"].includes(key)) return
      try {
        localStorage.removeItem(getKey(key))
      } catch (err) {
        console.error("Error removing from localstorage:", err)
      }
    },
    [getKey]
  )

  return { getItem, setItem, removeItem, getKey }
}
