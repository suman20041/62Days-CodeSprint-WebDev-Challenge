// src/types/skillExchange.ts

export interface User {
  id: string;
  name: string;
  avatar?: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  rating: number; // average rating 0-5
  completedSessions: number;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  role?: 'mentor' | 'learner' | 'admin';
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SkillMatch {
  mentor: User;
  learner: User;
  matchingScore: number; // 0-100
  commonInterest: string[];
}

export interface Session {
  id: string;
  date: string; // ISO date string
  time: string; // ISO time string
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  mentor: User;
  learner: User;
}

export interface Review {
  id: string;
  rating: number; // 1-5
  comment: string;
  reviewer: User; // who wrote the review
  reviewee: User; // who is being reviewed
  sessionId: string;
}

export interface Analytics {
  skillsShared: number;
  completedSessions: number;
  averageRating: number;
  learningProgress: { date: string; sessions: number }[]; // for charting
}
