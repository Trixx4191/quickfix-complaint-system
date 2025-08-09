"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Background Stars */}
      <Stars />

      {/* Content Section */}
      <section className="relative z-10 text-center max-w-3xl animate-slide-in-up px-4">
        {/* Logo + Heading */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Image
            src="/assets/quickfix-logo.png"
            alt="QuickFix Logo"
            width={64}
            height={64}
            className="drop-shadow-lg"
            priority
          />
          <h1
            className="text-6xl font-extrabold tracking-tight relative inline-block
            bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent
            after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-cyan-500 after:rounded-full
            after:opacity-60 after:blur-md"
          >
            Welcome to QuickFix
          </h1>
        </div>

        <p className="text-lg sm:text-xl text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)] mb-10 max-w-lg mx-auto">
          Experience the future of complaint management — fast, transparent, and effortlessly effective.
        </p>

        <div className="flex justify-center gap-6">
          <Link
            href="/login"
            className="inline-block bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg
              transition-transform duration-300 transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500"
          >
            Get Started
          </Link>

          <Link
            href="/register"
            className="inline-block border border-cyan-600 text-cyan-400 hover:bg-cyan-600 hover:text-white font-semibold py-3 px-8 rounded-xl
              shadow-sm transition-colors duration-300 hover:shadow-lg active:scale-95"
          >
            Register
          </Link>
        </div>
      </section>
    </main>
  );
}

function Stars() {
  const stars = Array.from({ length: 80 }).map(() => {
    return {
      cx: Math.random() * 100 + "%",
      cy: Math.random() * 100 + "%",
      r: Math.random() * 1.2 + 0.3,
      opacity: 0.4 + Math.random() * 0.6,
      flickerDuration: 1 + Math.random() * 3,
      flickerDelay: Math.random() * 3,
    };
  });

  return (
    <svg
      className="absolute inset-0 w-full h-full -z-10 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {stars.map(({ cx, cy, r, opacity, flickerDuration, flickerDelay }, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="white"
          opacity={opacity}
          style={{
            animation: `flicker ${flickerDuration}s ease-in-out infinite`,
            animationDelay: `${flickerDelay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes flicker {
          0%, 100% {opacity: 1;}
          50% {opacity: 0.3;}
        }
      `}</style>
    </svg>
  );
}
