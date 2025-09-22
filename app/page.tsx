import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import HeroSection from "@/components/sections/hero"
import Features from "@/components/sections/features"
import IntegrationsSection from "@/components/sections/integrations"
import FooterSection from "@/components/sections/footer"

export default async function Home() {
  const { userId } = await auth()

  // If user is signed in, redirect to dashboard
  if (userId) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      <Features />
      <IntegrationsSection />
      <FooterSection />
    </div>
  )
}
