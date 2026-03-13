import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/dealer/',
          '/api/',
          '/checkout/',
          '/cart/',
          '/wishlist/',
          '/orders/',
        ],
      },
    ],
    sitemap: 'https://autohood.com/sitemap.xml',
  }
}
