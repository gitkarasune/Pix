"use client"

import { UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "./theme-toggle"
import Logo from "./logo"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, User, Home } from "lucide-react"

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md border-dashed dark:bg-zinc-950/50 lg:dark:bg-transparent">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center">
            <Logo />
          </Link>

          <nav className="flex items-center gap-3 md:gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2 sm:hidden md:flex lg:flex xl:flex 2xl:flex" />
                Gallery
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/favorites">
                <Heart className="h-4 w-4 mr-2 sm:hidden md:flex lg:flex xl:flex 2xl:flex" />
                Favorites
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile">
                <User className="h-4 w-4 mr-2 sm:hidden md:flex lg:flex xl:flex 2xl:flex" />
                Profile
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}
