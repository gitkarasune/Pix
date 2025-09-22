import Logo from "@/components/logo"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Logo />

        <div className="flex space-x-1">
          <div className="h-1 w-1 animate-bounce rounded-full bg-black dark:bg-white [animation-delay:-0.3s]"></div>
          <div className="h-1 w-1 animate-bounce rounded-full bg-black dark:bg-white [animation-delay:-0.15s]"></div>
          <div className="h-1 w-1 animate-bounce rounded-full bg-black dark:bg-white"></div>
        </div>

        <p className="text-sm">Loading your gallery....</p>
      </div>
    </div>
  )
}
