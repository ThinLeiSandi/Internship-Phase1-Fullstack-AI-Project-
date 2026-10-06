import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

// Zod Schema 1: Registration Validation
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["user", "admin"]).optional()
});

// Zod Schema 2: Login Validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z.string().min(1, "Password is required")
});

// Zod Schema 3: Task Validation
export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional()
});

// Generic Zod Validation Middleware Generator
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation Error",
          errors: error.issues.map((issue: z.ZodIssue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        });
      }
      next(error);
    }
  };
};
