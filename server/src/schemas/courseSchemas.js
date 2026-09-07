import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  category: z.string().min(2, "Category is required"),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal(""))
});

export const addLectureSchema = z.object({
  title: z.string().min(2, "Lecture title is required"),
  videoUrl: z.string().url("A valid video URL is required"),
  duration: z.number().min(0).optional(),
  isPreview: z.boolean().optional(),
  resources: z.array(z.object({ name: z.string(), url: z.string().url() })).optional()
});

export const quizSchema = z.object({
  title: z.string().min(2, "Quiz title is required"),
  questions: z
    .array(
      z.object({
        question: z.string().min(1),
        options: z.array(z.string().min(1)).min(2, "At least 2 options required"),
        correctOptionIndex: z.number().min(0)
      })
    )
    .min(1, "At least one question is required")
});
