import { databases, users } from "@/models/server/config";
import { answerCollection, db, voteCollection, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import React from "react";
import Link from "next/link";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Meteors } from "@/components/ui/meteors";
import { Particles } from "@/components/ui/particles";
import QuestionCard from "@/components/QuestionCard";
import { UserPrefs } from "@/store/Auth";
import Pagination from "@/components/Pagination";
import Search from "./Search";
import { QuestionDocument } from "@/models";

const Page = async ({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; tag?: string; search?: string }>; // ✅
}) => {
    const { page, tag, search } = await searchParams; // ✅
    
    const currentPage = page || "1"; // use destructured variable

    const queries = [
        Query.orderDesc("$createdAt"),
        Query.offset((+currentPage - 1) * 25),
        Query.limit(25),
    ];

    if (tag) queries.push(Query.equal("tags", tag));
    if (search)
        queries.push(
            Query.or([
                Query.search("title", search),
                Query.search("content", search),
            ])
        );

    const questions = await databases.listDocuments(db, questionCollection, queries);
    console.log("Questions", questions)

    questions.documents = await Promise.all(
        questions.documents.map(async ques => {
            const [author, answers, votes] = await Promise.all([
                users.get<UserPrefs>(ques.authorId),
                databases.listDocuments(db, answerCollection, [
                    Query.equal("questionId", ques.$id),
                    Query.limit(1), // for optimization
                ]),
                databases.listDocuments(db, voteCollection, [
                    Query.equal("type", "question"),
                    Query.equal("typeId", ques.$id),
                    Query.limit(1), // for optimization
                ]),
            ]);

            

            return {
                ...ques,
                totalAnswers: answers.total,
                totalVotes: votes.total,
                author: {
                    $id: author.$id,
                    reputation: author.prefs.reputation,
                    name: author.name,
                },
            };
        })
    );

    const plainQuestions = questions.documents as unknown as QuestionDocument[];

    return (

        <div className="relative isolate min-h-screen overflow-hidden bg-black">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_40%),linear-gradient(180deg,_rgba(10,10,10,0.98),_rgba(0,0,0,1))]" />
                <Particles
                    className="absolute inset-0 h-full w-full"
                    quantity={120}
                    ease={70}
                    color="#e2e8f0"
                    staticity={40}
                />
                <Meteors number={24} className="opacity-50" />
            </div>
            <div className="container relative z-10 mx-auto min-h-screen px-4 pb-20 pt-36">
                <div className="mx-auto w-full max-w-4xl">
                    <div className="mb-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
                        <h1 className="text-3xl font-bold">All Questions</h1>
                        <Link href="/questions/ask">
                            <ShimmerButton className="shadow-2xl">
                                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                    Ask a question
                                </span>
                            </ShimmerButton>
                        </Link>
                    </div>
                    <div className="mb-4 w-full">
                        <Search />
                    </div>
                    <div className="mb-4 w-full">
                        <p>{questions.total} questions</p>
                    </div>
                    <div className="mb-4 w-full space-y-6">
                        {plainQuestions.map(ques => (
                            <QuestionCard key={ques.$id} ques={ques} />
                        ))}
                    </div>
                </div>
            </div>
            <Pagination total={questions.total} limit={25} />
        </div>
    );
};

export default Page;
