import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import { MarkdownPreview } from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";
import { Particles } from "@/components/ui/particles";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Meteors } from "@/components/ui/meteors";
import { avatars } from "@/models/client/config";
import {
    answerCollection,
    db,
    voteCollection,
    questionCollection,
    commentCollection,
    questionAttachmentBucket,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { storage } from "@/models/client/config";
import { AnswerDocumentList } from "@/models";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";
import DeleteQuestion from "./DeleteQuestion";
import EditQuestion from "./EditQuestion";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { CommentWithAuthor } from "@/models";
import { Models } from "appwrite";
import { VoteDocument } from "@/models";

const toPlain = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const Page = async ({
    params,
}: {
    params: Promise<{ quesId: string; quesName: string }>;
}) => {
    const { quesId } = await params;

    const [question, answers, upvotes, downvotes, comments] = await Promise.all([
        databases.getDocument(db, questionCollection, quesId),
        databases.listDocuments(db, answerCollection, [
            Query.orderDesc("$createdAt"),
            Query.equal("questionId", quesId),
        ]),
        databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", quesId),
            Query.equal("type", "question"),
            Query.equal("voteStatus", "upvoted"),
            Query.limit(1), // for optimization
        ]),
        databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", quesId),
            Query.equal("type", "question"),
            Query.equal("voteStatus", "downvoted"),
            Query.limit(1), // for optimization
        ]),
        databases.listDocuments(db, commentCollection, [
            Query.equal("type", "question"),
            Query.equal("typeId", quesId),
            Query.orderDesc("$createdAt"),
        ]),
    ]);

    // since it is dependent on the question, we fetch it here outside of the Promise.all
    const author = await users.get<UserPrefs>(question.authorId);
    [comments.documents, answers.documents] = await Promise.all([
        Promise.all(
            comments.documents.map(async comment => {
                const author = await users.get<UserPrefs>(comment.authorId);
                return {
                    ...comment,
                    author: {
                        $id: author.$id,
                        name: author.name,
                        reputation: author.prefs.reputation,
                    },
                };
            })
        ),
        Promise.all(
            answers.documents.map(async answer => {
                const [author, comments, upvotes, downvotes] = await Promise.all([
                    users.get<UserPrefs>(answer.authorId),
                    databases.listDocuments(db, commentCollection, [
                        Query.equal("typeId", answer.$id),
                        Query.equal("type", "answer"),
                        Query.orderDesc("$createdAt"),
                    ]),
                    databases.listDocuments(db, voteCollection, [
                        Query.equal("typeId", answer.$id),
                        Query.equal("type", "answer"),
                        Query.equal("voteStatus", "upvoted"),
                        Query.limit(1), // for optimization
                    ]),
                    databases.listDocuments(db, voteCollection, [
                        Query.equal("typeId", answer.$id),
                        Query.equal("type", "answer"),
                        Query.equal("voteStatus", "downvoted"),
                        Query.limit(1), // for optimization
                    ]),
                ]);

                comments.documents = await Promise.all(
                    comments.documents.map(async comment => {
                        const author = await users.get<UserPrefs>(comment.authorId);
                        return {
                            ...comment,
                            author: {
                                $id: author.$id,
                                name: author.name,
                                reputation: author.prefs.reputation,
                            },
                        };
                    })
                );

                return {
                    ...answer,
                    comments,
                    upvotesDocuments: upvotes,
                    downvotesDocuments: downvotes,
                    author: {
                        $id: author.$id,
                        name: author.name,
                        reputation: author.prefs.reputation,
                    },
                };
            })
        ),
    ]);

    const plainQuestion = toPlain(question);
    const plainAnswers = toPlain(answers as unknown as AnswerDocumentList);
    const plainUpvotes = toPlain(upvotes);
    const plainDownvotes = toPlain(downvotes);
    const plainComments = toPlain(comments);

    return (
        <TracingBeam className="container pl-6">
            <Particles
                className="fixed inset-0 z-0 h-full w-full"
                quantity={500}
                ease={100}
                color="#ffffff"
                refresh
            />
            <div className="relative mx-auto overflow-hidden px-4 pb-20 pt-36">
                <div className="pointer-events-none absolute inset-0 z-0">
                    <Meteors number={24} className="opacity-60" />
                </div>
                <div className="flex">
                    <div className="w-full">
                        <h1 className="mb-1 text-3xl font-bold">{plainQuestion.title}</h1>
                        <div className="flex gap-4 text-sm">
                            <span>
                                Asked {convertDateToRelativeTime(new Date(plainQuestion.$createdAt))}
                            </span>
                            <span>Answer {plainAnswers.total}</span>
                            <span>Votes {plainUpvotes.total + plainDownvotes.total}</span>
                        </div>
                    </div>
                    <Link href="/questions/ask" className="ml-auto inline-block shrink-0">
                        <ShimmerButton className="shadow-2xl">
                            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                Ask a question
                            </span>
                        </ShimmerButton>
                    </Link>
                </div>
                <hr className="relative z-10 my-4 border-white/40" />
                <div className="relative z-10 flex gap-4">
                    <div className="flex shrink-0 flex-col items-center gap-4">
                        <VoteButtons
                            type="question"
                            id={plainQuestion.$id}
                            className="w-full"
                            upvotes={plainUpvotes as unknown as Models.DocumentList<VoteDocument>}    // ✅
                            downvotes={plainDownvotes as unknown as Models.DocumentList<VoteDocument>} // ✅
                        />
                        <EditQuestion
                            questionId={plainQuestion.$id}
                            questionTitle={plainQuestion.title}
                            authorId={plainQuestion.authorId}
                        />
                        <DeleteQuestion
                            questionId={plainQuestion.$id}
                            authorId={plainQuestion.authorId}
                        />
                    </div>
                    <div className="w-full overflow-auto">
                        <MarkdownPreview className="rounded-xl p-4" source={plainQuestion.content} />
                        {plainQuestion.attachmentId ? (
                            <picture>
                                <img
                                    src={storage.getFileView({
                                        bucketId: questionAttachmentBucket,
                                        fileId: plainQuestion.attachmentId,
                                    })}
                                    alt={plainQuestion.title}
                                    className="mt-3 rounded-lg h-45"
                                />
                            </picture>
                        ) : null}
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                            {plainQuestion.tags.map((tag: string) => (
                                <Link
                                    key={tag}
                                    href={`/questions?tag=${tag}`}
                                    className="inline-block rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-1">
                            <picture>
                                <img
                                    src={avatars.getInitials(author.name, 36, 36)}
                                    alt={author.name}
                                    className="rounded-lg"
                                />
                            </picture>
                            <div className="block leading-tight">
                                <Link
                                    href={`/users/${author.$id}/${slugify(author.name)}`}
                                    className="text-orange-500 hover:text-orange-600"
                                >
                                    {author.name}
                                </Link>
                                <p>
                                    <strong>{author.prefs.reputation}</strong>
                                </p>
                            </div>
                        </div>
                        <Comments
                            comments={plainComments as unknown as Models.DocumentList<CommentWithAuthor>}
                            className="mt-4"
                            type="question"
                            typeId={plainQuestion.$id}
                        />
                        <hr className="my-4 border-white/40" />
                    </div>
                </div>
                <div className="relative z-10">
                    <Answers answers={plainAnswers} questionId={plainQuestion.$id} />
                </div>
            </div>
        </TracingBeam>
    );
};

export default Page;
