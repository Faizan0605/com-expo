import { Models } from "appwrite";

export type QuestionDocument = Models.Document & {
    title: string;
    content: string;
    authorId: string;
    tags: string[];
    attachmentId?: string | null;
};
