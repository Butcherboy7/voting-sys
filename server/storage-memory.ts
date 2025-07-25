import { type Candidate, type InsertCandidate, type Vote, type InsertVote, type User, type InsertUser, type VoteResult, type VotingStats } from "@shared/schema";
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

export class MemoryStorage implements IStorage {
  private users: User[] = [];
  private candidates: Candidate[] = [];
  private votes: Vote[] = [];
  private settings: Map<string, string> = new Map();
  private nextUserId = 1;
  private nextCandidateId = 1;
  private nextVoteId = 1;

  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    await this.initializeCandidates();
    await this.initializeSettings();
  }

  private async initializeCandidates() {
    if (this.candidates.length === 0) {
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

      for (const candidate of initialCandidates) {
        await this.createCandidate(candidate);
      }
    }
  }

  private async initializeSettings() {
    if (!this.settings.has("leaderboard_visible_time")) {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 24);
      this.settings.set("leaderboard_visible_time", futureTime.toISOString());
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = {
      id: this.nextUserId++,
      email: insertUser.email,
      password: hashedPassword,
      name: insertUser.name,
      isAdmin: false,
      hasVoted: false,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async getCandidates(): Promise<Candidate[]> {
    return [...this.candidates];
  }

  async getCandidate(id: number): Promise<Candidate | undefined> {
    return this.candidates.find(candidate => candidate.id === id);
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const candidate: Candidate = {
      id: this.nextCandidateId++,
      ...insertCandidate,
    };
    this.candidates.push(candidate);
    return candidate;
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const vote: Vote = {
      id: this.nextVoteId++,
      candidateId: insertVote.candidateId,
      userId: insertVote.userId,
      timestamp: new Date(),
    };
    this.votes.push(vote);
    return vote;
  }

  async hasUserVoted(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    return user?.hasVoted || false;
  }

  async markUserAsVoted(userId: number): Promise<void> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.hasVoted = true;
    }
  }

  async getVoteResults(): Promise<VoteResult[]> {
    const candidatesList = await this.getCandidates();
    const voteCounts = new Map<number, number>();
    
    for (const vote of this.votes) {
      voteCounts.set(vote.candidateId, (voteCounts.get(vote.candidateId) || 0) + 1);
    }

    const totalVotes = this.votes.length;

    const results: VoteResult[] = candidatesList.map(candidate => {
      const voteCount = voteCounts.get(candidate.id) || 0;
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
    
    const totalUsers = this.users.filter(user => !user.isAdmin).length;
    const turnoutRate = totalUsers > 0 ? Math.round((totalVotes / totalUsers) * 100) : 0;
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
    return [...this.votes].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getSetting(key: string): Promise<string | null> {
    return this.settings.get(key) || null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    this.settings.set(key, value);
  }
}

export const storage = new MemoryStorage();