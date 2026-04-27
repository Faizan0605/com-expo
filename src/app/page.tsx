import Link from "next/link";

const primaryRoutes = [
  {
    href: "/questions",
    label: "Questions",
    description: "Browse reports, warnings, and public discussions.",
  },
  {
    href: "/questions/ask",
    label: "Report a Company",
    description: "Publish a post about a scam or fake company.",
  },
  {
    href: "/login",
    label: "Login",
    description: "Sign in to share evidence and reply to reports.",
  },
  {
    href: "/register",
    label: "Register",
    description: "Join the platform and help warn other people.",
  },
];

const dynamicRouteTemplates = [
  "/questions/[quesId]/[quesName]",
  "/questions/[quesId]/[quesName]/edit",
  "/users/[userId]/[userSlug]",
  "/users/[userId]/[userSlug]/answers",
  "/users/[userId]/[userSlug]/edit",
  "/users/[userId]/[userSlug]/questions",
  "/users/[userId]/[userSlug]/votes",
];

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.22),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(249,115,22,0.18),_transparent_24%),linear-gradient(160deg,_#050816_0%,_#111827_52%,_#1f2937_100%)] px-6 py-12 text-white sm:px-10 lg:px-16">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur md:p-12">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-amber-300/35 bg-amber-200/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-100">
              Scam Exposure Platform
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Expose scam companies, document fake businesses, and protect the community.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              This platform is built to collect reports, evidence, and public
              discussion around suspicious companies so more people can spot red
              flags before they get trapped.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {primaryRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="group rounded-[1.75rem] border border-white/15 bg-white/10 p-6 shadow-[0_20px_45px_rgba(0,0,0,0.22)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-amber-300/45 hover:bg-white/15"
            >
              <div className="flex h-full flex-col">
                <span className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-200">
                  Route
                </span>
                <h2 className="mt-4 text-2xl font-semibold text-white">
                  {route.label}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {route.description}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-amber-200">{route.href}</span>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white transition group-hover:border-amber-300/50 group-hover:text-amber-100">
                    Open
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="rounded-[2rem] border border-white/15 bg-slate-950/45 p-8 shadow-[0_20px_45px_rgba(0,0,0,0.22)] backdrop-blur">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Investigation Routes
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                These route patterns support detailed case pages, user
                investigation profiles, and follow-up threads tied to specific
                reports.
              </p>
            </div>
            <Link
              href="/questions"
              className="inline-flex w-fit rounded-full border border-amber-300/40 bg-amber-200/10 px-4 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-200/20"
            >
              Explore active reports
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {dynamicRouteTemplates.map((route) => (
              <div
                key={route}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 font-mono text-sm text-slate-200"
              >
                {route}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
