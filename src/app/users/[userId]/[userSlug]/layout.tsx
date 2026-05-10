import { avatars } from "@/models/client/config";
import { users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import React from "react";
import EditButton from "./EditButton";
import Navbar from "./Navbar";
import { IconClockFilled, IconUserFilled } from "@tabler/icons-react";
import { Meteors } from "@/components/ui/meteors";

const Layout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ userId: string; userSlug: string }>;
}) => {
    const { userId } = await params;

    const user = await users.get<UserPrefs>(userId);

    return (
        /* Base profile backdrop with the requested radial glow over a near-black vertical fade. */
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_40%),linear-gradient(180deg,_rgba(10,10,10,0.98),_rgba(0,0,0,1))] text-white">
            {/* Ambient grid overlay to give the dark background a bit more texture. */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
            {/* Slow meteor streaks add movement without competing with the profile content. */}
            <Meteors number={18} className="opacity-40" />

            {/* Content stays above the decorative background layers. */}
            <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-32">
                <section className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/8 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur md:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <picture className="block size-24 shrink-0 overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.35)] sm:size-28">
                                <img
                                    src={avatars.getInitials(user.name, 200, 200)}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                />
                            </picture>

                            <div className="space-y-2">
                                <p className="inline-flex rounded-full border border-amber-300/30 bg-amber-200/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-100">
                                    Public profile
                                </p>
                                <div>
                                    <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                        {user.name}
                                    </h1>
                                    <p className="mt-1 break-all text-sm text-slate-300 sm:text-base">
                                        {user.email}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 text-sm text-slate-300 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                                    <p className="flex items-center gap-2">
                                        <IconUserFilled className="w-4 shrink-0 text-amber-200" />
                                        Joined {convertDateToRelativeTime(new Date(user.$createdAt))}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <IconClockFilled className="w-4 shrink-0 text-amber-200" />
                                        Active {convertDateToRelativeTime(new Date(user.$updatedAt))}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0">
                            <EditButton />
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
                    <Navbar />
                    <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/6 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur sm:p-6">
                        {children}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Layout;
