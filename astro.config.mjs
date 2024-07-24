import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  vite: {
    define: {
      'import.meta.env.PUBLIC_MAPBOX_TOKEN': JSON.stringify(process.env.PUBLIC_MAPBOX_TOKEN),
    },
    ssr: {
      external: ["@mapbox/mapbox-gl-geocoder"],
    },
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    inlineStylesheets: 'auto'
  },
  site: 'https://yoursitedomain.com', // Replace with your actual domain
  base: '/', // Update this if your site is not hosted at the root
});