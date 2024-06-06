import { defineConfig } from 'astro/config';
import critters from 'astro-critters';

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  // output: 'server',
  // devToolbar: {
  //   enabled: false
  // },
  // integrations: [critters()],
  adapter: node({
    mode: "middleware"
  })
});