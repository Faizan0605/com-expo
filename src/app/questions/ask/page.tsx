"use client";

import QuestionForm from "@/components/QuestionForm";
import { Particles } from "@/components/ui/particles";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";

export default function AskPage() {
    const { hydrated, user } = useAuthStore();

    if (!hydrated) {
        return (
            <div className="relative isolate min-h-screen overflow-hidden bg-black">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_40%),linear-gradient(180deg,_rgba(10,10,10,0.98),_rgba(0,0,0,1))]" />
                    <Particles
                        className="absolute inset-0 h-full w-full"
                        quantity={90}
                        ease={70}
                        color="#e2e8f0"
                        staticity={40}
                    />
                </div>
                <div className="container relative z-10 mx-auto px-4 pb-20 pt-36">
                    <div className="mx-auto max-w-5xl animate-pulse space-y-6">
                        <div className="h-8 w-56 rounded bg-white/10" />
                        <div className="h-5 w-full max-w-2xl rounded bg-white/5" />
                        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="h-[640px] rounded-3xl border border-white/10 bg-white/5" />
                            <div className="h-[320px] rounded-3xl border border-white/10 bg-white/5" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="relative isolate min-h-screen overflow-hidden bg-black">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_40%),linear-gradient(180deg,_rgba(10,10,10,0.98),_rgba(0,0,0,1))]" />
                    <Particles
                        className="absolute inset-0 h-full w-full"
                        quantity={90}
                        ease={70}
                        color="#e2e8f0"
                        staticity={40}
                    />
                </div>
                <div className="container relative z-10 mx-auto px-4 pb-20 pt-36">
                    <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 text-center shadow-2xl shadow-black/30 md:p-12">
                        <span className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-200">
                            Sign in required
                        </span>
                        <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                            Ask your next question in RiverFlow
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                            You need an account to publish questions, add tags, and keep track of your
                            discussions. Sign in to post, or create an account if you&apos;re new here.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href="/login">
                                <ShimmerButton className="shadow-2xl">
                                    <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                                        Login to ask
                                    </span>
                                </ShimmerButton>
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/5"
                            >
                                Create account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
            </div>
            <div className="container relative z-10 mx-auto px-4 pb-20 pt-36">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-10 max-w-3xl">
                        <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1 text-sm text-emerald-200">
                            Public question
                        </span>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
                            What do you need help with?
                        </h1>
                        <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                            Write a clear title, explain the problem, and add a few relevant tags so
                            other developers can understand and answer faster.
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div>
                            <QuestionForm />
                        </div>

                        <aside className="space-y-4">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <h2 className="text-lg font-semibold text-white">Tips for a strong question</h2>
                                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                    <li>Use a title that names the exact bug, error, or behavior.</li>
                                    <li>Explain what you expected, what happened, and what you already tried.</li>
                                    <li>Add only the tags that truly describe the technologies involved.</li>
                                    <li>An image is optional, but useful when the issue is visual.</li>
                                </ul>
                            </div>

                            <div className="rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 p-6">
                                <h2 className="text-lg font-semibold text-white">Before you publish</h2>
                                <p className="mt-3 text-sm leading-6 text-slate-300">
                                    Make sure the body has enough detail for someone else to reproduce
                                    or understand the problem without extra back-and-forth.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
}
