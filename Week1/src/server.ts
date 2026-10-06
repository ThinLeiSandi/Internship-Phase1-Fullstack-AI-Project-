import cors from "cors";
import express from "express";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "./db/prisma";
import { authenticateJWT, requireRole, AuthenticatedRequest } from "./middleware/auth";
import { validate, registerSchema, loginSchema, taskSchema } from "./middleware/validate";
import { globalErrorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Middleware 1: Body parser
app.use(express.json());

// Middleware 2: HTTP Request Logger (Morgan)
app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(globalErrorHandler);

// 0. HEALTH CHECK ROUTE
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
}); 

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Express TypeScript PostgreSQL API!",
    status: "Healthy",
    endpoints: {
      auth: ["POST /auth/register", "POST /auth/login"],
      users: ["GET /users", "GET /users/:id", "PUT /users/:id", "DELETE /users/:id"],
      tasks: ["POST /tasks", "GET /tasks", "PUT /tasks/:id"]
    }
  });
});


app.delete(
  "/tasks/:id",
  authenticateJWT,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const id = parseInt(req.params.id as string);
      const userId = req.user!.id;

      const task = await prisma.task.findUnique({
        where: { id },
      });

      if (!task || task.userId !== userId) {
        return res.status(404).json({
          message: "Task not found.",
        });
      }

      await prisma.task.delete({
        where: { id },
      });

      res.json({
        message: "Task deleted successfully",
        id,
      });
    } catch (error) {
      next(error);
    }
  }
);


// 1. AUTH ROUTES (With Zod Validation)

// REGISTER
app.post("/auth/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "user"
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

app.post("/auth/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
});

// 2. USER ROUTES

app.get("/users", authenticateJWT, async (req: AuthenticatedRequest, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.get("/users/:id", authenticateJWT, async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

app.put("/users/:id", authenticateJWT, requireRole("admin"), async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    const { name, email, role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

app.delete("/users/:id", authenticateJWT, requireRole("admin"), async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted successfully", id });
  } catch (error) {
    next(error);
  }
});

// 3. TASK ROUTES (With Zod Validation)

app.post("/tasks", authenticateJWT, validate(taskSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { title, description } = req.body;
    const userId = req.user!.id;

    const newTask = await prisma.task.create({
      data: { title, description, userId }
    });

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

app.get("/tasks", authenticateJWT, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const tasks = await prisma.task.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

app.put("/tasks/:id", authenticateJWT, async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    const { title, description, completed } = req.body;
    const userId = req.user!.id;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      return res.status(404).json({ message: "Task not found." });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, completed }
    });

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});


app.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const ragResponse = await fetch("http://host.docker.internal:8000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    });

    if (!ragResponse.ok) {
      return res.status(502).json({
        message: "RAG service returned an error",
      });
    }

    const data = await ragResponse.json();

    return res.json({
      answer: data.answer,
    });
  } catch (error) {
    console.error("Chat route error:", error);

    return res.status(500).json({
      message: "Unable to process the question",
    });
  }
});


app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running with Validation & Logging on http://localhost:${PORT}`);
});
