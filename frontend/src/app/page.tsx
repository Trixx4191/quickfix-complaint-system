import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-950 via-slate-900 to-black text-white">
      <section className="text-center px-4 max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Welcome to QuickFix
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-300">
          A modern complaint management system built for speed, transparency, and ease of use.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition"
          >
            Get Started
          </Link>
          <Link
            href="/register"
            className="inline-block border border-white text-white hover:bg-white hover:text-black font-semibold py-3 px-6 rounded-lg transition"
          >
            Register
          </Link>
        </div>
      </section>
    </main>
  );
}
