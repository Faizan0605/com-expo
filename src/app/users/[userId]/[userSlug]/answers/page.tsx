import Pagination from "@/components/Pagination";
import { MarkdownPreview } from "@/components/RTE";
import { answerCollection, db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ userId: string; userSlug: string }>;
    searchParams: Promise<{ page?: string }>;
}) => {
    const { userId } = await params;
    const resolvedSearchParams = await searchParams;
    const currentPage = resolvedSearchParams.page || "1";

    const queries = [
        Query.equal("authorId", userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+currentPage - 1) * 25),
        Query.limit(25),
    ];

    const answers = await databases.listDocuments(db, answerCollection, queries);

    answers.documents = await Promise.all(
        answers.documents.map(async ans => {
            const question = await databases.getDocument(db, questionCollection, ans.questionId, [
                Query.select(["title"]),
            ]);
            return { ...ans, question };
        })
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                        Contributions
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Answers</h2>
                </div>
                <p className="text-sm text-slate-300">{answers.total} answers</p>
            </div>

            <div className="space-y-5">
                {answers.documents.map(ans => (
                    <div
                        key={ans.$id}
                        className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.2)]"
                    >
                        <div className="max-h-48 overflow-auto rounded-2xl border border-white/8 bg-black/20 p-1">
                            <MarkdownPreview
                                source={ans.content}
                                className="rounded-xl bg-transparent p-4 text-slate-200"
                            />
                        </div>
                        <Link
                            href={`/questions/${ans.questionId}/${slugify(ans.question.title)}`}
                            className="mt-4 inline-flex shrink-0 rounded-full border border-amber-300/35 bg-amber-200/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-200/20"
                        >
                            Open question
                        </Link>
                    </div>
                ))}
            </div>

            <Pagination total={answers.total} limit={25} className="text-slate-200" />
        </div>
    );
};

export default Page;
