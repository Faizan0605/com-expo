//this file is for type exports
import { Models } from "appwrite";

export type QuestionDocument = Models.Document & {
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  attachmentId: string | null;
};

export type CommentDocument = Models.Document & {
  content: string;
  type: "question" | "answer";
  typeId: string;
  authorId: string;
};

export type AnswerDocument = Models.Document & {
  content: string;
  authorId: string;
  questionId: string;
};

export type VoteDocument = Models.Document & {
  type: "question" | "answer";
  voteStatus: "upvoted" | "downvoted";
  typeId: string;
  votedById: string;
};
