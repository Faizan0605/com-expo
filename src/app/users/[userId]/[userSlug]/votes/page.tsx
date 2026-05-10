import Pagination from "@/components/Pagination";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ userId: string; userSlug: string }>;
    searchParams: Promise<{ page?: string; voteStatus?: "upvoted" | "downvoted" }>;
}) => {
    const { userId, userSlug } = await params;
    const resolvedSearchParams = await searchParams;
    const currentPage = resolvedSearchParams.page || "1";

    const query = [
        Query.equal("votedById", userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+currentPage - 1) * 25),
        Query.limit(25),
    ];

    if (resolvedSearchParams.voteStatus) {
        query.push(Query.equal("voteStatus", resolvedSearchParams.voteStatus));
    }

    const votes = await databases.listDocuments(db, voteCollection, query);

    votes.documents = await Promise.all(
        votes.documents.map(async vote => {
            const questionOfTypeQuestion =
                vote.type === "question"
                    ? await databases.getDocument(db, questionCollection, vote.typeId, [
                          Query.select(["title"]),
                      ])
                    : null;

            if (questionOfTypeQuestion) {
                return {
                    ...vote,
                    question: questionOfTypeQuestion,
                };
            }

            const answer = await databases.getDocument(db, answerCollection, vote.typeId);
            const questionOfTypeAnswer = await databases.getDocument(
                db,
                questionCollection,
                answer.questionId,
                [Query.select(["title"])]
            );

            return {
                ...vote,
                question: questionOfTypeAnswer,
            };
        })
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Votes</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Voting history</h2>
                    <p className="mt-2 text-sm text-slate-300">{votes.total} votes</p>
                </div>

                <ul className="flex flex-wrap gap-2">
                    <li>
                        <Link
                            href={`/users/${userId}/${userSlug}/votes`}
                            className={`block w-full rounded-full px-4 py-2 text-sm font-medium duration-200 ${
                                !resolvedSearchParams.voteStatus
                                    ? "bg-white text-black"
                                    : "bg-white/6 text-slate-200 hover:bg-white/12"
                            }`}
                        >
                            All
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={`/users/${userId}/${userSlug}/votes?voteStatus=upvoted`}
                            className={`block w-full rounded-full px-4 py-2 text-sm font-medium duration-200 ${
                                resolvedSearchParams.voteStatus === "upvoted"
                                    ? "bg-white text-black"
                                    : "bg-white/6 text-slate-200 hover:bg-white/12"
                            }`}
                        >
                            Upvotes
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={`/users/${userId}/${userSlug}/votes?voteStatus=downvoted`}
                            className={`block w-full rounded-full px-4 py-2 text-sm font-medium duration-200 ${
                                resolvedSearchParams.voteStatus === "downvoted"
                                    ? "bg-white text-black"
                                    : "bg-white/6 text-slate-200 hover:bg-white/12"
                            }`}
                        >
                            Downvotes
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="space-y-4">
                {votes.documents.map(vote => (
                    <div
                        key={vote.$id}
                        className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 duration-200 hover:bg-white/10"
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                            <p className="mr-4 shrink-0 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                                {vote.voteStatus}
                            </p>
                            <p className="min-w-0">
                                <Link
                                    href={`/questions/${vote.question.$id}/${slugify(vote.question.title)}`}
                                    className="text-amber-200 transition hover:text-amber-100"
                                >
                                    {vote.question.title}
                                </Link>
                            </p>
                        </div>
                        <p className="mt-3 text-right text-sm text-slate-400">
                            {convertDateToRelativeTime(new Date(vote.$createdAt))}
                        </p>
                    </div>
                ))}
            </div>

            <Pagination total={votes.total} limit={25} className="text-slate-200" />
        </div>
    );
};

export default Page;
