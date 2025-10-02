"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import {
  SiFacebook,
  SiInstagram,
  SiLinkedin,
  SiBluesky,
  SiPinterest,
  SiReddit,
  SiTumblr,
} from "react-icons/si"
import { X, Share2, MessageCircle, Copy } from "lucide-react"
import {
  FaWhatsapp,
  FaTelegram,
  FaTiktok,
  FaSnapchatGhost,
} from "react-icons/fa"
import { toast } from "sonner"

interface ShareDrawerProps {
  isOpen: boolean
  onClose: () => void
  url: string
}

const socialPlatforms = [
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    url: (link: string) => `https://wa.me/?text=${encodeURIComponent(link)}`,
  },
  {
    name: "Instagram",
    icon: SiInstagram,
    url: () => "https://instagram.com",
  }, // IG no direct sharing
  {
    name: "TikTok",
    icon: FaTiktok,
    url: () => "https://tiktok.com",
  },
  {
    name: "Facebook",
    icon: SiFacebook,
    url: (link: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        link
      )}`,
  },
  {
    name: "X",
    icon: X,
    url: (link: string) =>
      `https://x.com/intent/tweet?url=${encodeURIComponent(link)}`,
  },
  { name: "Bluesky", icon: SiBluesky, url: () => "https://bsky.app" },
  {
    name: "Telegram",
    icon: FaTelegram,
    url: (link: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(link)}`,
  },
  {
    name: "LinkedIn",
    icon: SiLinkedin,
    url: (link: string) =>
      `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(link)}`,
  },
  { name: "Snapchat", icon: FaSnapchatGhost, url: () => "https://snapchat.com" },
  {
    name: "Messenger",
    icon: MessageCircle,
    url: (link: string) => `fb-messenger://share?link=${encodeURIComponent(link)}`,
  },
  {
    name: "Pinterest",
    icon: SiPinterest,
    url: (link: string) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(link)}`,
  },
  {
    name: "Reddit",
    icon: SiReddit,
    url: (link: string) => `https://reddit.com/submit?url=${encodeURIComponent(link)}`,
  },
  {
    name: "Tumblr",
    icon: SiTumblr,
    url: (link: string) =>
      `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(
        link
      )}`,
  },
]

export default function ShareDrawer({ isOpen, onClose, url }: ShareDrawerProps) {
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Image URL copied to clipboard!")
    } catch {
      toast.error("Failed to copy link")
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="relative rounded-t-2xl sm:rounded-2xl max-w-2xl mx-auto w-full p-6 shadow-2xl overflow-hidden">
        {/* Gradient Backgrounds */}
        <div className="absolute pointer-events-none -z-0 top-20 left-20 w-72 h-72 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute pointer-events-none -z-0 bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute pointer-events-none -z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 dark:from-indigo-500/10 dark:to-cyan-500/10 rounded-full blur-3xl" />

        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" /> Share Image
          </DrawerTitle>
        </DrawerHeader>

        {/* Copy URL Button */}
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleCopyUrl}
            className="flex items-center gap-2 px-4"
            variant="outline"
          >
            <Copy className="h-4 w-4" />
            Copy Image URL
          </Button>
        </div>

        {/* Social Buttons Grid */}
        <div className="relative z-50 grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon
            return (
              <Button
                key={platform.name}
                variant="outline"
                className="flex flex-col items-center justify-center gap-2 h-20"
                onClick={() => {
                  const shareUrl = platform.url(url)
                  window.open(shareUrl, "_blank")
                }}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs">{platform.name}</span>
              </Button>
            )
          })}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
