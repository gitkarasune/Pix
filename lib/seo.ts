export const defaultSEO = {
  title: 'Pix | Discover, Remix & Chat with Stunning Images',
  description:
    'Pix is your AI-powered image discovery and creativity hub. Search millions of high-quality photos, remix images with AI, and chat about designs — all in one elegant platform.',
  url: 'https://pix-sand.vercel.app',
  image: '/og-image.png',
  twitterHandle: '@_kendev',
  siteName: 'Pix - AI Image Discovery & Creativity Platform',
  keywords: [
    'Pix',
    'AI image search',
    'AI image remix',
    'Unsplash alternative',
    'AI photography assistant',
    'creative image ideas',
    'Next.js image gallery',
    'AI design inspiration',
    'Kara Sune',
    'Full-stack developer',
    'React developer portfolio',
  ],
}

// Helper to dynamically generate SEO metadata per page
export function getSEOMetadata({
  title,
  description,
  image,
  url,
}: Partial<typeof defaultSEO>) {
  const metaTitle = title || defaultSEO.title
  const metaDesc = description || defaultSEO.description
  const metaImage = image || defaultSEO.image
  const metaUrl = url || defaultSEO.url

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: defaultSEO.keywords.join(', '),
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: metaUrl,
      siteName: defaultSEO.siteName,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: 'Pix - AI Image Discovery Platform',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: [metaImage],
      site: defaultSEO.twitterHandle,
    },
  }
}
