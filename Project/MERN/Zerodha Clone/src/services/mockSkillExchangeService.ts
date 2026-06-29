// src/services/mockSkillExchangeService.ts

import { User, Skill, SkillMatch, Session, Review, Analytics } from '../types/skillExchange';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Sample data
const sampleSkills: Skill[] = [
  { id: generateId(), name: 'React', category: 'Frontend', level: 'Advanced' },
  { id: generateId(), name: 'Node.js', category: 'Backend', level: 'Advanced' },
  { id: generateId(), name: 'GraphQL', category: 'API', level: 'Intermediate' },
  { id: generateId(), name: 'Docker', category: 'DevOps', level: 'Intermediate' },
  { id: generateId(), name: 'TypeScript', category: 'Language', level: 'Advanced' },
];

const sampleUsers: User[] = [
  {
    id: generateId(),
    name: 'Alice Johnson',
    avatar: '',
    skillsOffered: [sampleSkills[0], sampleSkills[4]],
    skillsWanted: [sampleSkills[1]],
    rating: 4.5,
    completedSessions: 12,
    experienceLevel: 'Advanced',
    role: 'mentor',
  },
  {
    id: generateId(),
    name: 'Bob Patel',
    avatar: '',
    skillsOffered: [sampleSkills[1]],
    skillsWanted: [sampleSkills[0], sampleSkills[4]],
    rating: 4.2,
    completedSessions: 8,
    experienceLevel: 'Intermediate',
    role: 'learner',
  },
  {
    id: generateId(),
    name: 'Carol Singh',
    avatar: '',
    skillsOffered: [sampleSkills[2], sampleSkills[3]],
    skillsWanted: [sampleSkills[0]],
    rating: 4.8,
    completedSessions: 15,
    experienceLevel: 'Advanced',
    role: 'mentor',
  },
  {
    id: generateId(),
    name: 'David Liu',
    avatar: '',
    skillsOffered: [],
    skillsWanted: [sampleSkills[2], sampleSkills[3]],
    rating: 0,
    completedSessions: 0,
    experienceLevel: 'Beginner',
    role: 'learner',
  },
  // add more as needed
];

let sessions: Session[] = [];
let reviews: Review[] = [];

export const mockSkillExchangeService = {
  getSkills: async (): Promise<Skill[]> => {
    return new Promise((res) => setTimeout(() => res(sampleSkills), 200));
  },
  getMentors: async (): Promise<User[]> => {
    return new Promise((res) => setTimeout(() => res(sampleUsers.filter(u => u.role === 'mentor')), 200));
  },
  getLearners: async (): Promise<User[]> => {
    return new Promise((res) => setTimeout(() => res(sampleUsers.filter(u => u.role === 'learner')), 200));
  },
  findMatches: async (skillId: string): Promise<SkillMatch[]> => {
    const skill = sampleSkills.find(s => s.id === skillId);
    if (!skill) return [];
    const mentors = sampleUsers.filter(u => u.role === 'mentor' && u.skillsOffered.some(s => s.id === skillId));
    const learners = sampleUsers.filter(u => u.role === 'learner' && u.skillsWanted.some(s => s.id === skillId));
    const matches: SkillMatch[] = [];
    mentors.forEach(m => {
      learners.forEach(l => {
        const common = m.skillsOffered.filter(s => l.skillsWanted.some(w => w.id === s.id)).map(s => s.name);
        const score = Math.round((common.length / Math.max(m.skillsOffered.length, l.skillsWanted.length)) * 100);
        matches.push({ mentor: m, learner: l, matchingScore: score, commonInterest: common });
      });
    });
    return new Promise((res) => setTimeout(() => res(matches), 200));
  },
  createSkillRequest: async (userId: string, skillId: string): Promise<void> => {
    // In mock, just push to learner's wanted list
    const user = sampleUsers.find(u => u.id === userId);
    const skill = sampleSkills.find(s => s.id === skillId);
    if (user && skill && !user.skillsWanted.some(s => s.id === skillId)) {
      user.skillsWanted.push(skill);
    }
    return new Promise((res) => setTimeout(() => res(), 200));
  },
  scheduleSession: async (mentorId: string, learnerId: string, date: string, time: string): Promise<Session> => {
    const mentor = sampleUsers.find(u => u.id === mentorId);
    const learner = sampleUsers.find(u => u.id === learnerId);
    const newSession: Session = {
      id: generateId(),
      date,
      time,
      status: 'pending',
      mentor: mentor!,
      learner: learner!,
    };
    sessions.push(newSession);
    return new Promise((res) => setTimeout(() => res(newSession), 200));
  },
  submitReview: async (sessionId: string, reviewerId: string, rating: number, comment: string): Promise<Review> => {
    const session = sessions.find(s => s.id === sessionId);
    const reviewer = sampleUsers.find(u => u.id === reviewerId);
    if (!session || !reviewer) throw new Error('Invalid session or reviewer');
    const reviewee = reviewerId === session.mentor.id ? session.learner : session.mentor;
    const review: Review = {
      id: generateId(),
      rating,
      comment,
      reviewer,
      reviewee,
      sessionId,
    };
    reviews.push(review);
    // Update rating averages (simple incremental)
    const allReviews = reviews.filter(r => r.reviewee.id === reviewee.id);
    reviewee.rating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    return new Promise((res) => setTimeout(() => res(review), 200));
  },
  getAnalytics: async (): Promise<Analytics> => {
    const skillsShared = sessions.length; // each session = a skill shared
    const completed = sessions.filter(s => s.status === 'completed').length;
    const avgRating = sampleUsers.filter(u => u.rating).reduce((sum, u) => sum + u.rating, 0) / sampleUsers.filter(u => u.rating).length;
    const progress = sessions.reduce((acc, s) => {
      const key = s.date;
      const entry = acc.find(e => e.date === key);
      if (entry) entry.sessions += 1; else acc.push({ date: key, sessions: 1 });
      return acc;
    }, [] as { date: string; sessions: number }[]);
    return new Promise((res) => setTimeout(() => res({ skillsShared, completedSessions: completed, averageRating: avgRating, learningProgress: progress }), 200));
  },
  // helper to update session status for testing
  updateSessionStatus: (sessionId: string, status: Session['status']) => {
    const sess = sessions.find(s => s.id === sessionId);
    if (sess) sess.status = status;
  },
};
