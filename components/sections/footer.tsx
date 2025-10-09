
import Logo from '../logo'

export default function FooterSection() {
  return (
    <footer className="border-t bg-muted/30 py-10 md:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center space-y-8">
          <Logo />

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