// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from 'vite';

const env = loadEnv(
  process.env.NODE_ENV || 'development',
  process.cwd(),
  ""
);

console.log('Loaded Sanity env vars:', { 
  id: env.PUBLIC_SANITY_PROJECT_ID, 
  dataset: env.PUBLIC_SANITY_DATASET 
});

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = env;

// https://astro.build/config
export default defineConfig({
  site: 'https://lintrahub.com',
  integrations: [
    tailwind(),
    react(),
    sitemap(),
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false,
    })
  ]
});