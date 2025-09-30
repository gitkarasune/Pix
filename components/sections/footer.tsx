
import Link from 'next/link'
import Logo from '../logo'

const links = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "Gallery",
    href: "/dashboard",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: 'Pricing',
    href: '/pricing',
  },
]

export default function FooterSection() {
  return (
    <footer className="border-t bg-muted/30 py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center space-y-8">
          <Logo />

          <div className="flex flex-wrap justify-center gap-8 text-sm">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="hover:text-muted-foreground text-foreground transition-colors duration-150"
              >
                <span>{link.title}</span>
              </Link>
            ))}
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-black dark:text-white">Discover millions of beautiful images powered by AI</p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Pix. All rights reserved. Images provided by Unsplash.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}