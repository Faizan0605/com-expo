import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import React from "react";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { answerCollection, db, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";

const stats = [
    {
        key: "reputation",
        label: "Reputation",
        description: "Trust built through reports, answers, and steady participation.",
        accent: "from-amber-300/40 via-orange-400/20 to-transparent",
    },
    {
        key: "questions",
        label: "Questions asked",
        description: "Public scam reports and investigation threads started by this user.",
        accent: "from-sky-300/35 via-cyan-400/15 to-transparent",
    },
    {
        key: "answers",
        label: "Answers given",
        description: "Replies contributed to help others verify or challenge claims.",
        accent: "from-emerald-300/35 via-teal-400/15 to-transparent",
    },
] as const;

const Page = async ({
    params,
}: {
    params: Promise<{ userId: string; userSlug: string }>;
}) => {
    const { userId } = await params;

    const [user, questions, answers] = await Promise.all([
        users.get<UserPrefs>(userId),
        databases.listDocuments(db, questionCollection, [
            Query.equal("authorId", userId),
            Query.limit(1),
        ]),
        databases.listDocuments(db, answerCollection, [
            Query.equal("authorId", userId),
            Query.limit(1),
        ]),
    ]);

    return (
        <div className="space-y-6">
            <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Overview</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Activity snapshot
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                    A quick look at how {user.name.split(" ")[0]} has contributed across reports,
                    responses, and overall reputation.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {stats.map(stat => {
                    const value =
                        stat.key === "reputation"
                            ? user.prefs.reputation
                            : stat.key === "questions"
                              ? questions.total
                              : answers.total;

                    return (
                        <MagicCard
                            key={stat.key}
                            className="rounded-[1.75rem] border border-white/12 bg-white/8 shadow-[0_20px_55px_rgba(0,0,0,0.28)]"
                        >
                            <div className="relative flex min-h-64 flex-col justify-between p-6">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                                        {stat.label}
                                    </p>
                                    <p className="mt-4 text-sm leading-6 text-slate-300">
                                        {stat.description}
                                    </p>
                                </div>

                                <div className="mt-10">
                                    <p className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                                        <NumberTicker value={value} />
                                    </p>
                                </div>

                                <div
                                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t ${stat.accent}`}
                                />
                            </div>
                        </MagicCard>
                    );
                })}
            </div>
        </div>
    );
};

export default Page;
