// src/services/skillExchangeService.ts

import { User, Skill, SkillMatch, Session, Review, Analytics } from '../types/skillExchange';

/**
 * Placeholder for real backend API integration.
 * All functions currently proxy to the mock service for local development.
 */
export const skillExchangeService = {
  getSkills: async (): Promise<Skill[]> => {
    // TODO: Replace with real API call
    return [];
  },
  getMentors: async (): Promise<User[]> => {
    return [];
  },
  getLearners: async (): Promise<User[]> => {
    return [];
  },
  findMatches: async (skillId: string): Promise<SkillMatch[]> => {
    return [];
  },
  createSkillRequest: async (userId: string, skillId: string): Promise<void> => {
    // no-op
  },
  scheduleSession: async (mentorId: string, learnerId: string, date: string, time: string): Promise<Session> => {
    // no-op
    // dummy session for type safety
    return {
      id: '',
      date,
      time,
      status: 'pending',
      mentor: {} as User,
      learner: {} as User,
    };
  },
  submitReview: async (sessionId: string, reviewerId: string, rating: number, comment: string): Promise<Review> => {
    return {
      id: '',
      rating,
      comment,
      reviewer: {} as User,
      reviewee: {} as User,
      sessionId,
    };
  },
  getAnalytics: async (): Promise<Analytics> => {
    return {
      skillsShared: 0,
      completedSessions: 0,
      averageRating: 0,
      learningProgress: [],
    };
  },
};
