"use client";
import Navbar from "@/components/Navbar";
import Examples from "@/components/Examples";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen">
      <Navbar />
      <div className="relative w-full min-h-screen px-6 py-24 overflow-hidden bg-gray-900 shadow-2xl isolate sm:px-24 xl:py-32">
        <h1 className="max-w-2xl mx-auto mt-16 text-5xl font-bold tracking-tight text-center text-white sm:text-6xl">
          xgeeks AI
        </h1>

        <p className="max-w-xl mx-auto mt-4 text-xl leading-8 text-center text-slate-400">
          Example use cases to get you started.
        </p>

        <Examples />

        <svg
          viewBox="0 0 1024 1024"
          className="absolute left-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2"
          aria-hidden="true"
        >
          <circle
            cx={512}
            cy={512}
            r={512}
            fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
            fillOpacity="0.5"
          />
          <defs>
            <radialGradient
              id="759c1415-0410-454c-8f7c-9a820de03641"
              cx={0}
              cy={0}
              r={1}
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(512 512) rotate(90) scale(512)"
            >
              <stop stopColor="rgb(17 24 39)" />
              <stop offset={1} stopColor="rgb(125 211 252)" stopOpacity={0} />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </main>
  );
}
