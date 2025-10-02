import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Brain, Download, Heart, Search, Sparkles, Zap } from "lucide-react"
import { ReactNode } from 'react'

export default function Features() {
  return (
    <section id="features" className="bg-muted/30 py-16 md:py-32">
      <div className="@container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 blur-3xl dark:blur-3xl pointer-events-none -z-0" />
          <h2 className="text-balance text-4xl font-bold lg:text-5xl mb-4">
            Everything you need for
            <span className="">
              {" "}
              visual discovery
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you find, organize, and download the perfect images for any project.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardDecorator>
                <Search className="size-6 text-blue-600" />
              </CardDecorator>
              <h3 className="text-xl font-semibold mt-4">Smart Search</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced search capabilities with filters, categories, and intelligent suggestions to find exactly what
                you need.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardDecorator>
                <Brain className="size-6 text-purple-600" />
              </CardDecorator>
              <h3 className="text-xl font-semibold mt-4">AI Analysis</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get detailed AI-powered insights about images including mood, colors, and contextual suggestions.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardDecorator>
                <Download className="size-6 text-green-600" />
              </CardDecorator>
              <h3 className="text-xl font-semibold mt-4">Instant Downloads</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Download high-quality images in multiple resolutions instantly, with proper attribution tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardDecorator>
                <Heart className="size-6 text-red-600" />
              </CardDecorator>
              <h3 className="text-xl font-semibold mt-4">Personal Gallery</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Save your favorite images to personal collections and organize them with custom tags and categories.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardDecorator>
                <Sparkles className="size-6 text-yellow-600" />
              </CardDecorator>
              <h3 className="text-xl font-semibold mt-4">Curated Collections</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Discover handpicked collections and trending images curated by our AI and community.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardDecorator>
                <Zap className="size-6 text-orange-600" />
              </CardDecorator>
              <h3 className="text-xl font-semibold mt-4">Lightning Fast</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Optimized performance with lazy loading, caching, and progressive image enhancement for smooth browsing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
        />

        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)