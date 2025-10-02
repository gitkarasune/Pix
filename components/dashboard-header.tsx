"use client"

import { UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "./theme-toggle"
import Logo from "./logo"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, User, Home, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md border-dashed dark:bg-zinc-950/50 lg:dark:bg-transparent"> 
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center ">
          <Link href="/dashboard" className="flex items-center">
            <Logo />
          </Link>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Menu className="h-4 w-4" />
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Gallery
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/favorites" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favorites
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  )
}
