import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all candidates
  app.get("/api/candidates", async (_req, res) => {
    try {
      const candidates = await storage.getCandidates();
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch candidates" });
    }
  });

  // Submit a vote
  app.post("/api/vote", async (req, res) => {
    try {
      // Generate session ID from IP and user agent (simple session tracking)
      const sessionId = req.ip + req.get('User-Agent') || 'anonymous';
      
      // Check if user has already voted
      const hasVoted = await storage.hasUserVoted(sessionId);
      if (hasVoted) {
        return res.status(400).json({ message: "You have already voted" });
      }

      // Validate request body
      const voteData = insertVoteSchema.parse({
        candidateId: req.body.candidateId,
        sessionId
      });

      // Verify candidate exists
      const candidate = await storage.getCandidate(voteData.candidateId);
      if (!candidate) {
        return res.status(400).json({ message: "Invalid candidate" });
      }

      // Create the vote
      const vote = await storage.createVote(voteData);
      res.json({ message: "Vote submitted successfully", vote });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid vote data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to submit vote" });
      }
    }
  });

  // Check if user has voted
  app.get("/api/vote-status", async (req, res) => {
    try {
      const sessionId = req.ip + req.get('User-Agent') || 'anonymous';
      const hasVoted = await storage.hasUserVoted(sessionId);
      res.json({ hasVoted });
    } catch (error) {
      res.status(500).json({ message: "Failed to check vote status" });
    }
  });

  // Get voting results
  app.get("/api/results", async (_req, res) => {
    try {
      const results = await storage.getVoteResults();
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch results" });
    }
  });

  // Get voting statistics
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getVotingStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Get recent voting activity
  app.get("/api/recent-activity", async (_req, res) => {
    try {
      const votes = await storage.getAllVotes();
      const candidates = await storage.getCandidates();
      
      const recentActivity = votes.slice(0, 10).map(vote => {
        const candidate = candidates.find(c => c.id === vote.candidateId);
        return {
          candidateName: candidate?.name || 'Unknown',
          timestamp: vote.timestamp
        };
      });
      
      res.json(recentActivity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
