// @ts-check
import { defineConfig, sessionDrivers } from 'astro/config';
import starlight from '@astrojs/starlight';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
    session: {
            // Starlight does not require KV-backed sessions by default.
            // This prevents auto-injecting a KV binding without an `id` into generated Wrangler config.
            driver: sessionDrivers.fsLite(),
    },

  integrations: [
      starlight({
          title: 'OpenIlang',
          social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
          sidebar: [
              {
                  label: 'Guides',
                  items: [
                      // Each item here is one entry in the navigation menu.
                      { label: 'Example Guide', slug: 'guides/example' },
                  ],
              },
              {
                  label: 'Reference',
                  autogenerate: { directory: 'reference' },
              },
          ],
      }),
	],

  adapter: cloudflare({
      config: {
          // Wrangler expects `triggers` to contain only allowed keys.
          triggers: {
              crons: [],
          },
      },

      platformProxy: {
          enabled: true
      },

      prerenderEnvironment: 'node',

      imageService: "cloudflare"
  }),
});