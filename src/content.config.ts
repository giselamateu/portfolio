import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const localized = z.object({
  subtitle: z.string(),
  tagline: z.string(),
  concept: z.array(z.string()),
  credits: z.array(z.object({ role: z.string(), value: z.string() })),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/index.md',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      year: z.number(),
      season: z.string(),
      title: z.string(),
      client: z.string().optional(),
      cover: image(),
      cardCover: image().optional(),
      coverAlt: z.string(),
      moodboard: image(),
      paletteBoard: image(),
      palette: z.array(z.object({ hex: z.string(), name: z.string() })),
      lineup: z.array(image()),
      clo: z.array(image()).default([]),
      processBoard: image(),
      processMoulage: image().optional(),
      editorial: z.array(image()),
      fichas: z.array(image()),
      i18n: z.object({ es: localized, en: localized }),
    }),
});

export const collections = { projects };
