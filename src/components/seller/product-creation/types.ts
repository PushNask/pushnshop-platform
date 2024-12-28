import { z } from 'zod'

export const productSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .transform(val => val.replace(/<[^>]*>/g, '')), // Strip HTML
  price: z.number()
    .min(1000, 'Minimum price is 1000 XAF')
    .max(1000000, 'Maximum price is 1000000 XAF'),
  duration: z.number()
    .min(24, 'Duration must be between 24 and 720 hours')
    .max(720, 'Duration must be between 24 and 720 hours'),
  images: z.instanceof(FileList)
    .refine(files => files.length <= 7, 'Maximum 7 images allowed')
    .refine(files => {
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 5 * 1024 * 1024) return false;
      }
      return true;
    }, 'Each image must be less than 5MB')
    .refine(files => {
      for (let i = 0; i < files.length; i++) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(files[i].type)) return false;
      }
      return true;
    }, 'Only JPG, PNG and WebP images are allowed')
})

export type ProductFormData = z.infer<typeof productSchema>