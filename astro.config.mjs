import { defineConfig } from 'astro/config'

// https://astro.build/config
import tailwind from '@astrojs/tailwind'
import critters from 'astro-critters'
import prefetch from '@astrojs/prefetch'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  // site: 'website-url',
  server: {
    host: true
  },
  integrations: [
    tailwind(),
    critters(),
    prefetch(),
    sitemap({
      lastmod: new Date()
    })
  ]
})
