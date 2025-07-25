import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-memory";
import { insertVoteSchema, insertUserSchema, loginSchema, adminLoginSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

interface AuthenticatedRequest extends Request {
  session: any;
}

const isAuthenticated = (req: AuthenticatedRequest, res: any, next: any) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
};

const isAdmin = (req: AuthenticatedRequest, res: any, next: any) => {
  if (req.session.isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Admin access required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  const sessionTtl = 24 * 60 * 60 * 1000;
  const MemStore = MemoryStore(session);
  const sessionStore = new MemStore({
    checkPeriod: sessionTtl,
  });

  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'student-elections-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: sessionTtl,
    },
  }));

  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const user = await storage.createUser(userData);
      res.json({ message: "Registration successful", user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Registration failed" });
      }
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(loginData.email);
      if (!user || !(await storage.verifyPassword(user, loginData.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      (req as AuthenticatedRequest).session.userId = user.id;
      (req as AuthenticatedRequest).session.isAdmin = user.isAdmin;
      res.json({ message: "Login successful", user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid login data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Login failed" });
      }
    }
  });

  app.post("/api/admin-login", async (req, res) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);
      if (username === "admin" && password === "password") {
        (req as AuthenticatedRequest).session.isAdmin = true;
        (req as AuthenticatedRequest).session.userId = 0;
        res.json({ message: "Admin login successful" });
      } else {
        res.status(401).json({ message: "Invalid admin credentials" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid admin login data" });
    }
  });

  app.post("/api/logout", (req, res) => {
    (req as AuthenticatedRequest).session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/user", isAuthenticated, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      if (authReq.session.isAdmin && authReq.session.userId === 0) {
        res.json({ id: 0, email: "admin@admin.com", name: "Admin", isAdmin: true, hasVoted: false });
      } else {
        const user = await storage.getUser(authReq.session.userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin, hasVoted: user.hasVoted });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/candidates", async (_req, res) => {
    try {
      const candidates = await storage.getCandidates();
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch candidates" });
    }
  });

  app.post("/api/vote", isAuthenticated, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.session.userId;
      
      if (authReq.session.isAdmin) {
        return res.status(403).json({ message: "Admins cannot vote" });
      }

      const hasVoted = await storage.hasUserVoted(userId);
      if (hasVoted) {
        return res.status(400).json({ message: "You have already voted" });
      }

      const voteData = insertVoteSchema.parse({
        candidateId: req.body.candidateId,
        userId
      });

      const candidate = await storage.getCandidate(voteData.candidateId);
      if (!candidate) {
        return res.status(400).json({ message: "Invalid candidate" });
      }

      const vote = await storage.createVote(voteData);
      await storage.markUserAsVoted(userId);
      res.json({ message: "Vote submitted successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid vote data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to submit vote" });
      }
    }
  });

  app.get("/api/results", async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const stats = await storage.getVotingStats();
      
      if (!authReq.session.isAdmin && !stats.leaderboardVisible) {
        return res.status(403).json({ message: "Results not yet available" });
      }

      const results = await storage.getVoteResults();
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch results" });
    }
  });

  app.get("/api/stats", isAdmin, async (_req, res) => {
    try {
      const stats = await storage.getVotingStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.get("/api/recent-activity", isAdmin, async (_req, res) => {
    try {
      const votes = await storage.getAllVotes();
      const candidates = await storage.getCandidates();
      
      const recentActivity = await Promise.all(
        votes.slice(0, 10).map(async (vote) => {
          const candidate = candidates.find(c => c.id === vote.candidateId);
          const user = await storage.getUser(vote.userId);
          return {
            candidateName: candidate?.name || 'Unknown',
            voterName: user?.name || 'Unknown',
            timestamp: vote.timestamp
          };
        })
      );
      
      res.json(recentActivity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  app.post("/api/set-leaderboard-time", isAdmin, async (req, res) => {
    try {
      const { time } = req.body;
      await storage.setSetting("leaderboard_visible_time", new Date(time).toISOString());
      res.json({ message: "Leaderboard time updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update leaderboard time" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
