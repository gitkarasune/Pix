"use client";

import Script from "next/script";
import { defaultSEO } from "@/lib/seo";

export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Pix",
    alternateName: ["Pix AI", "Pix Image Discovery", "Pix App"],
    url: defaultSEO.url,
    image: defaultSEO.image,
    applicationCategory: "Creative Tool",
    operatingSystem: "Web",
    description: defaultSEO.description,
    creator: {
      "@type": "Person",
      name: "Kara Sune",
      url: "https://karasune.vercel.app",
      sameAs: [
        "https://x.com/_kendev",
        "https://github.com/gitKarasune",
        "https://linkedin.com/in/sune-kara",
      ],
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${defaultSEO.url}/search?q={query}`,
      "query-input": "required name=query",
    },
  };

  return (
    <Script
      id="json-ld-pix"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
