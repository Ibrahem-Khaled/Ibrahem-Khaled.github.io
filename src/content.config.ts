import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const work = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    routeSlug: z.string(),
    order: z.number().int().min(1),
    year: z.string(),
    status: z.enum(['shipped', 'in-progress']),
    role: z.string(),
    domain: z.string(),
    category: z.enum(['saas', 'ai', 'commerce', 'mobile']),
    summary: z.string(),
    stack: z.array(z.string()).min(1),
    nda: z.boolean().default(false),
    lang: z.enum(['en', 'ar']),
    headlineMetric: z.object({
      value: z.string(),
      label: z.string(),
    }),
    liveUrl: z.string().url().optional(),
    playStoreUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    coverImage: z
      .object({
        src: z.string(),
        alt: z.string(),
        width: z.number(),
        height: z.number(),
        urlLabel: z.string().optional(),
      })
      .optional(),
    diagramVariant: z
      .enum(['hawyati', 'magic-linker', 'abdulaziz-learn', 'multi-tenant-saas'])
      .optional(),
    team: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
        }),
      )
      .optional(),
  }),
})

export const collections = { work }
