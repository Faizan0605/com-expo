"use client";

import convertDateToRelativeTime from "@/utils/relativeTime";
import React from "react";

const ClientRelativeTime = ({
    date,
    className,
    prefix,
}: {
    date: string;
    className?: string;
    prefix?: string;
}) => {
    const label = React.useSyncExternalStore(
        () => () => {},
        () => convertDateToRelativeTime(new Date(date)),
        () => ""
    );

    return (
        <time dateTime={date} className={className} suppressHydrationWarning>
            {label ? `${prefix ?? ""}${label}` : ""}
        </time>
    );
};

export default ClientRelativeTime;
