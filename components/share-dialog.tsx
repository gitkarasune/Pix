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
      <DrawerContent style={{ zIndex: 9999 }} className="rounded-t-2xl sm:rounded-2xl max-w-3xl mx-auto w-full p-6 shadow-2xl z-40">

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
                <Icon className="h-20 w-20 text-3xl" />
                <span className="text-xs">{platform.name}</span>
              </Button>
            )
          })}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
