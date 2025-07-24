import { candidates, votes, users, settings, type Candidate, type InsertCandidate, type Vote, type InsertVote, type User, type InsertUser, type VoteResult, type VotingStats } from "@shared/schema";
import { db } from "./db";
import { eq, desc, count } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(user: User, password: string): Promise<boolean>;
  getCandidates(): Promise<Candidate[]>;
  getCandidate(id: number): Promise<Candidate | undefined>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  createVote(vote: InsertVote): Promise<Vote>;
  hasUserVoted(userId: number): Promise<boolean>;
  getVoteResults(): Promise<VoteResult[]>;
  getVotingStats(): Promise<VotingStats>;
  getAllVotes(): Promise<Vote[]>;
  getSetting(key: string): Promise<string | null>;
  setSetting(key: string, value: string): Promise<void>;
  markUserAsVoted(userId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    await this.initializeCandidates();
    await this.initializeSettings();
  }

  private async initializeCandidates() {
    const existingCandidates = await db.select().from(candidates);
    if (existingCandidates.length === 0) {
      const initialCandidates: InsertCandidate[] = [
        {
          name: "Ashvith",
          grade: "Senior, Computer Science",
          platform: "Focused on improving campus technology and student resources",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
        },
        {
          name: "Vaishnavi",
          grade: "Junior, Business Administration", 
          platform: "Dedicated to enhancing student life and campus activities",
          imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b332e234?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
        },
        {
          name: "Sandeep",
          grade: "Senior, Environmental Science",
          platform: "Committed to sustainability and environmental initiatives",
          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
        },
        {
          name: "Sujasree", 
          grade: "Junior, Psychology",
          platform: "Advocating for mental health resources and student support",
          imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
        },
        {
          name: "Shashank",
          grade: "Senior, Engineering",
          platform: "Promoting diversity, inclusion, and academic excellence", 
          imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
        }
      ];

      await db.insert(candidates).values(initialCandidates);
    }
  }

  private async initializeSettings() {
    const leaderboardSetting = await db.select().from(settings).where(eq(settings.key, "leaderboard_visible_time"));
    if (leaderboardSetting.length === 0) {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 24);
      await db.insert(settings).values({
        key: "leaderboard_visible_time",
        value: futureTime.toISOString()
      });
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async getCandidates(): Promise<Candidate[]> {
    return db.select().from(candidates);
  }

  async getCandidate(id: number): Promise<Candidate | undefined> {
    const [candidate] = await db.select().from(candidates).where(eq(candidates.id, id));
    return candidate || undefined;
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const [candidate] = await db
      .insert(candidates)
      .values(insertCandidate)
      .returning();
    return candidate;
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const [vote] = await db
      .insert(votes)
      .values(insertVote)
      .returning();
    return vote;
  }

  async hasUserVoted(userId: number): Promise<boolean> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user?.hasVoted || false;
  }

  async markUserAsVoted(userId: number): Promise<void> {
    await db.update(users).set({ hasVoted: true }).where(eq(users.id, userId));
  }

  async getVoteResults(): Promise<VoteResult[]> {
    const candidatesList = await this.getCandidates();
    const voteCounts = await db
      .select({
        candidateId: votes.candidateId,
        count: count(),
      })
      .from(votes)
      .groupBy(votes.candidateId);

    const totalVotes = voteCounts.reduce((sum, v) => sum + v.count, 0);

    const results: VoteResult[] = candidatesList.map(candidate => {
      const voteData = voteCounts.find(v => v.candidateId === candidate.id);
      const voteCount = voteData?.count || 0;
      const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

      return {
        candidate,
        voteCount,
        percentage
      };
    });

    results.sort((a, b) => b.voteCount - a.voteCount);
    return results;
  }

  async getVotingStats(): Promise<VotingStats> {
    const results = await this.getVoteResults();
    const totalVotes = results.reduce((sum, result) => sum + result.voteCount, 0);
    const leadingCandidate = results.length > 0 ? results[0].candidate.name : "No votes yet";
    
    const totalUsers = await db.select({ count: count() }).from(users).where(eq(users.isAdmin, false));
    const turnoutRate = totalUsers[0]?.count > 0 ? Math.round((totalVotes / totalUsers[0].count) * 100) : 0;
    const timeLeft = "2d 14h";

    const leaderboardTime = await this.getSetting("leaderboard_visible_time");
    const leaderboardVisible = leaderboardTime ? new Date() >= new Date(leaderboardTime) : false;

    return {
      totalVotes,
      turnoutRate,
      leadingCandidate,
      timeLeft,
      leaderboardVisible
    };
  }

  async getAllVotes(): Promise<Vote[]> {
    return db.select().from(votes).orderBy(desc(votes.timestamp));
  }

  async getSetting(key: string): Promise<string | null> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting?.value || null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value }
      });
  }
}

export const storage = new DatabaseStorage();
