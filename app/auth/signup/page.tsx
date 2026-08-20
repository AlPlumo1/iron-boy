"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";

import { signUp, type SignUpState } from "@/app/auth/actions";

const initialState: SignUpState = {};

function BrandSparkles() {
  return (
    <svg aria-hidden="true" className="h-6 w-7" viewBox="0 0 28 24">
      <path d="m5 0 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="currentColor" />
      <path d="m18 1 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" fill="currentColor" />
    </svg>
  );
}

function SignupSparkle() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7 text-cyan-200"
      viewBox="0 0 28 28"
    >
      <path
        d="m14 0 3 11 11 3-11 3-3 11-3-11-11-3 11-3 3-11Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BackArrow() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24">
      <path
        d="M19 12H5m7-7-7 7 7 7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-black px-6 py-12 text-white">
      <Image
        src="/IRON_Final.png"
        alt=""
        width={2924}
        height={2224}
        sizes="900px"
        className="pointer-events-none absolute -left-[280px] top-[180px] hidden h-auto w-[900px] max-w-none -rotate-90 opacity-[0.85] lg:block"
      />

      <Link
        href="/auth/login"
        aria-label="Revenir au login"
        className="group absolute left-5 top-8 z-10 flex h-10 w-10 items-center justify-center text-violet-300 transition duration-200 hover:-translate-x-0.5 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
      >
        <BackArrow />
        <span className="pointer-events-none absolute left-11 whitespace-nowrap rounded-full border border-violet-400/50 bg-black/90 px-3 py-1.5 text-xs text-violet-100 opacity-0 shadow-[0_0_16px_rgba(129,92,246,0.25)] transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          Revenir au login
        </span>
      </Link>

      <div className="absolute top-12 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[21px] font-medium tracking-[-0.04em] sm:text-2xl">
        <span>IRON</span>
        <BrandSparkles />
        <span>BOY</span>
      </div>

      <form
        action={formAction}
        className="relative flex w-full max-w-[482px] flex-col pt-24 lg:translate-y-[200px] lg:pt-0"
      >
        <label className="sr-only" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="EMAIL"
          className="h-[70px] rounded-full border border-violet-400 bg-[linear-gradient(90deg,#050505_46%,#0c061b_63%,#6123c1_84%,#b585ff_100%)] px-8 text-lg tracking-wide text-white outline-none placeholder:text-white focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200/50 sm:px-9"
        />

        <label className="sr-only" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="PASSWORD"
          className="mt-7 h-[70px] rounded-full border border-violet-400 bg-[linear-gradient(90deg,#050505_46%,#0c061b_63%,#6123c1_84%,#b585ff_100%)] px-8 text-lg tracking-wide text-white outline-none placeholder:text-white focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200/50 sm:mt-8 sm:px-9"
        />

        {state.error && (
          <p role="alert" className="mt-4 text-center text-sm text-red-300">
            {state.error}
          </p>
        )}

        {state.success && (
          <p role="status" className="mt-4 text-center text-sm text-cyan-200">
            Account created. Check your email to confirm your account.
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="group relative mx-auto mt-6 flex h-[104px] w-[250px] items-center justify-center text-3xl font-medium tracking-tight text-violet-200 transition duration-200 hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-2 inset-y-5 -rotate-[15deg] rounded-[50%] border border-cyan-200 transition duration-200 group-hover:border-violet-200 group-hover:shadow-[0_0_18px_rgba(160,119,255,0.7)]"
          />
          <span className="absolute left-3 top-[35px] -rotate-[15deg] transition duration-200 group-hover:scale-125 group-hover:text-cyan-100">
            <SignupSparkle />
          </span>
          <span className="relative transition duration-200 group-hover:text-white [text-shadow:1px_1px_0_#6d28d9]">
            {isPending ? "..." : "SIGNUP"}
          </span>
        </button>
      </form>
    </main>
  );
}
