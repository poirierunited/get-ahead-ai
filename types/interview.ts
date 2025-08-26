export interface GenerateInterviewRequest {
  title: string;
  role: string;
  level: string;
  techstack: string; // comma-separated list from client
  type: string;
  amount: number;
  userid?: string; // will be removed once auth is wired
}

export interface InterviewQuestionObject {
  prompt: string;
  options?: string[];
  answer?: string;
}

export type InterviewQuestion = string | InterviewQuestionObject;

export interface InterviewEntity {
  title: string;
  role: string;
  type: string;
  level: string;
  techstack: string[];
  questions: InterviewQuestion[];
  userId: string;
  finalized: boolean;
  coverImage?: string;
  createdAt: string; // ISO date string
}
