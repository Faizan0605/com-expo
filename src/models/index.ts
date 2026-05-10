//this file is for type exports
import { Models } from "appwrite";
import { UserPrefs } from "@/store/Auth";

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

export type Comment = Models.Document & {
    content: string;
    authorId: string;
    author: {
        name: string;
        $id: string;
    };
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

export type PublicUser = Pick<Models.User<UserPrefs>, "$id" | "name"> & {
  reputation: number;
};

export type CommentWithAuthor = CommentDocument & {
  author: PublicUser;
};

export type AnswerWithRelations = AnswerDocument & {
  author: PublicUser;
  comments: Models.DocumentList<CommentWithAuthor>;
  upvotesDocuments: Models.DocumentList<VoteDocument>;
  downvotesDocuments: Models.DocumentList<VoteDocument>;
};

export type AnswerDocumentList = Models.DocumentList<AnswerWithRelations>;
