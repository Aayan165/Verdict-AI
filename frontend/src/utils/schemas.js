import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const evaluateSchema = z.object({
  prompt: z.string().min(10, 'Prompt is too short'),
  response: z.string().min(10, 'Response is too short'),
  modelName: z.string().min(2, 'Model name is required'),
});

export const experimentSchema = z.object({
  name: z.string().min(3, 'Experiment name is required'),
  description: z.string().max(500).optional().or(z.literal('')),
});

export const experimentAttachSchema = z.object({
  experimentId: z.coerce.number().int().positive('Select an experiment'),
});