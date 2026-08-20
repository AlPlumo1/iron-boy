"use client";

import Link from "next/link";
import Image from "next/image";
import { useActionState } from "react";

import { signIn, type SignInState } from "@/app/auth/actions";

const initialState: SignInState = {};

function BrandSparkles() {
  return (
    <svg aria-hidden="true" className="h-6 w-7" viewBox="0 0 28 24">
      <path d="m5 0 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="currentColor" />
      <path d="m18 1 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" fill="currentColor" />
    </svg>
  );
}

function CornerSparkles() {
  return (
    <svg
      aria-hidden="true"
      className="absolute -bottom-2 -left-7 h-52 w-56 text-violet-500 sm:bottom-5 sm:left-2"
      viewBox="0 0 224 208"
    >
      <path
        d="m73 0 11 34 34 11-34 11-11 34-11-34-34-11 34-11L73 0Z"
        fill="currentColor"
      />
      <path
        d="m27 53 8 25 25 8-25 8-8 25-8-25-25-8 25-8 8-25Z"
        fill="currentColor"
      />
      <path
        d="m122 63 10 31 31 10-31 10-10 31-10-31-31-10 31-10 10-31Z"
        fill="currentColor"
      />
      <path
        d="m78 128 9 28 28 9-28 9-9 28-9-28-28-9 28-9 9-28Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Chevron() {
  return (
    <svg aria-hidden="true" className="h-11 w-8" viewBox="0 0 32 44">
      <path
        d="m5 3 20 19-20 19"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="4"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-black px-6 py-12 text-white">
      <CornerSparkles />

      <div className="relative flex w-full max-w-[482px] flex-col items-center">
        <div className="flex items-center gap-2 text-[21px] font-medium tracking-[-0.04em] sm:text-2xl">
          <span>IRON</span>
          <BrandSparkles />
          <span>BOY</span>
        </div>

        <div className="mt-7 w-full sm:mt-10">
          <Image
            src="/IRON_Final.png"
            alt=""
            width={2924}
            height={2224}
            sizes="(max-width: 639px) calc(100vw - 48px), 360px"
            preload
            className="mx-auto h-auto w-full max-w-[360px] drop-shadow-[0_18px_32px_rgba(86,58,186,0.2)]"
          />
        </div>

        <form
          action={formAction}
          className="mt-8 flex w-full flex-col sm:mt-10"
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
            autoComplete="current-password"
            placeholder="PASSWORD"
            className="mt-7 h-[70px] rounded-full border border-violet-400 bg-[linear-gradient(90deg,#050505_46%,#0c061b_63%,#6123c1_84%,#b585ff_100%)] px-8 text-lg tracking-wide text-white outline-none placeholder:text-white focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200/50 sm:mt-8 sm:px-9"
          />

          {state.error && (
            <p role="alert" className="mt-4 text-center text-sm text-red-300">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="group mx-auto mt-7 flex h-12 items-center justify-center text-violet-400 transition hover:text-violet-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-8"
          >
            <span className="sr-only">
              {isPending ? "Logging in..." : "Log in"}
            </span>
            <span className="flex -space-x-2 drop-shadow-[-2px_0_0_#76e2d6]">
              <Chevron />
              <Chevron />
              <Chevron />
              <Chevron />
            </span>
          </button>
        </form>

        <p className="mt-10 text-center text-sm font-medium tracking-wide sm:mt-12 sm:text-base">
          No account ?{" "}
          <Link
            href="/auth/signup"
            className="transition hover:text-violet-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
          >
            Signup now !
          </Link>
        </p>
      </div>
    </main>
  );
}
