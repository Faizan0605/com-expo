"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
    const { userId, userSlug } = useParams();
    const pathname = usePathname();

    const items = [
        {
            name: "Summary",
            href: `/users/${userId}/${userSlug}`,
        },
        {
            name: "Questions",
            href: `/users/${userId}/${userSlug}/questions`,
        },
        {
            name: "Answers",
            href: `/users/${userId}/${userSlug}/answers`,
        },
        {
            name: "Votes",
            href: `/users/${userId}/${userSlug}/votes`,
        },
    ];

    return (
        <ul className="flex w-full shrink-0 gap-2 overflow-x-auto rounded-[1.75rem] border border-white/10 bg-white/6 p-2 shadow-[0_20px_45px_rgba(0,0,0,0.2)] backdrop-blur lg:flex-col lg:overflow-visible">
            {items.map(item => (
                <li key={item.name} className="min-w-max lg:min-w-0">
                    <Link
                        href={item.href}
                        className={`block w-full rounded-full px-4 py-2 text-sm font-medium duration-200 ${
                            pathname === item.href
                                ? "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.22)]"
                                : "text-slate-200 hover:bg-white/12 hover:text-white"
                        }`}
                    >
                        {item.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default Navbar;
