import { candidates, votes, type Candidate, type InsertCandidate, type Vote, type InsertVote, type VoteResult, type VotingStats } from "@shared/schema";

export interface IStorage {
  // Candidate methods
  getCandidates(): Promise<Candidate[]>;
  getCandidate(id: number): Promise<Candidate | undefined>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  
  // Vote methods
  createVote(vote: InsertVote): Promise<Vote>;
  getVotesBySession(sessionId: string): Promise<Vote[]>;
  hasUserVoted(sessionId: string): Promise<boolean>;
  getVoteResults(): Promise<VoteResult[]>;
  getVotingStats(): Promise<VotingStats>;
  getAllVotes(): Promise<Vote[]>;
}

export class MemStorage implements IStorage {
  private candidates: Map<number, Candidate>;
  private votes: Map<number, Vote>;
  private candidateIdCounter: number;
  private voteIdCounter: number;

  constructor() {
    this.candidates = new Map();
    this.votes = new Map();
    this.candidateIdCounter = 1;
    this.voteIdCounter = 1;
    
    // Initialize with the 5 candidates from the design
    this.initializeCandidates();
  }

  private initializeCandidates() {
    const initialCandidates: InsertCandidate[] = [
      {
        name: "Emily Rodriguez",
        grade: "Senior, Computer Science",
        platform: "Focused on improving campus technology and student resources",
        imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b332e234?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
      },
      {
        name: "Marcus Thompson",
        grade: "Junior, Business Administration",
        platform: "Dedicated to enhancing student life and campus activities",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
      },
      {
        name: "Sarah Chen",
        grade: "Senior, Environmental Science",
        platform: "Committed to sustainability and environmental initiatives",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
      },
      {
        name: "David Wilson",
        grade: "Junior, Psychology",
        platform: "Advocating for mental health resources and student support",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
      },
      {
        name: "Aisha Patel",
        grade: "Senior, Engineering",
        platform: "Promoting diversity, inclusion, and academic excellence",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
      }
    ];

    initialCandidates.forEach(candidate => {
      this.createCandidate(candidate);
    });
  }

  async getCandidates(): Promise<Candidate[]> {
    return Array.from(this.candidates.values());
  }

  async getCandidate(id: number): Promise<Candidate | undefined> {
    return this.candidates.get(id);
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const id = this.candidateIdCounter++;
    const candidate: Candidate = { ...insertCandidate, id };
    this.candidates.set(id, candidate);
    return candidate;
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = this.voteIdCounter++;
    const vote: Vote = { 
      ...insertVote, 
      id, 
      timestamp: new Date() 
    };
    this.votes.set(id, vote);
    return vote;
  }

  async getVotesBySession(sessionId: string): Promise<Vote[]> {
    return Array.from(this.votes.values()).filter(
      vote => vote.sessionId === sessionId
    );
  }

  async hasUserVoted(sessionId: string): Promise<boolean> {
    const userVotes = await this.getVotesBySession(sessionId);
    return userVotes.length > 0;
  }

  async getVoteResults(): Promise<VoteResult[]> {
    const candidates = await this.getCandidates();
    const allVotes = Array.from(this.votes.values());
    const totalVotes = allVotes.length;

    const results: VoteResult[] = candidates.map(candidate => {
      const candidateVotes = allVotes.filter(vote => vote.candidateId === candidate.id);
      const voteCount = candidateVotes.length;
      const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

      return {
        candidate,
        voteCount,
        percentage
      };
    });

    // Sort by vote count descending
    results.sort((a, b) => b.voteCount - a.voteCount);
    return results;
  }

  async getVotingStats(): Promise<VotingStats> {
    const results = await this.getVoteResults();
    const totalVotes = results.reduce((sum, result) => sum + result.voteCount, 0);
    const leadingCandidate = results.length > 0 ? results[0].candidate.name : "No votes yet";
    
    // Mock data for turnout rate and time left (in a real app, these would be calculated)
    const turnoutRate = Math.min(Math.round((totalVotes / 500) * 100), 100); // Assuming 500 total students
    const timeLeft = "2d 14h"; // This would be calculated based on election end time

    return {
      totalVotes,
      turnoutRate,
      leadingCandidate,
      timeLeft
    };
  }

  async getAllVotes(): Promise<Vote[]> {
    return Array.from(this.votes.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}

export const storage = new MemStorage();
