import Pagination from "@/components/Pagination";
import QuestionCard from "@/components/QuestionCard";
import { QuestionDocument } from "@/models";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";

const Page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ userId: string; userSlug: string }>;
    searchParams: Promise<{ page?: string }>;
}) => {
    const { userId } = await params;
    const { page } = await searchParams;
    const currentPage = page || "1";

    const queries = [
        Query.equal("authorId", userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+currentPage - 1) * 25),
        Query.limit(25),
    ];

    const questions = await databases.listDocuments(db, questionCollection, queries);

    questions.documents = await Promise.all(
        questions.documents.map(async ques => {
            const [author, answers, votes] = await Promise.all([
                users.get<UserPrefs>(ques.authorId),
                databases.listDocuments(db, answerCollection, [
                    Query.equal("questionId", ques.$id),
                    Query.limit(1),
                ]),
                databases.listDocuments(db, voteCollection, [
                    Query.equal("type", "question"),
                    Query.equal("typeId", ques.$id),
                    Query.limit(1),
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
        <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                        Contributions
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Questions</h2>
                </div>
                <p className="text-sm text-slate-300">{questions.total} questions</p>
            </div>

            <div className="space-y-6">
                {plainQuestions.map(ques => (
                    <QuestionCard key={ques.$id} ques={ques} />
                ))}
            </div>

            <Pagination total={questions.total} limit={25} className="text-slate-200" />
        </div>
    );
};

export default Page;
