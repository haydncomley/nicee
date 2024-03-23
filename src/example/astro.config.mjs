import { defineConfig } from 'astro/config';
import critters from 'astro-critters';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false
  },
  integrations: [critters()]
});