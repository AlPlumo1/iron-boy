"use client";

import { useActionState } from "react";
import Link from "next/link";

import { signIn, type SignInState } from "@/app/auth/actions";

const initialState: SignInState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-bold">Log in to IronBoy</h1>

        <label className="flex flex-col gap-1">
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span>Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="rounded border px-3 py-2"
          />
        </label>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isPending ? "Logging in..." : "Log in"}
        </button>

        <p className="text-center text-sm">
          No account ?{" "}
          <Link
            href="/auth/signup"
            className="font-medium underline underline-offset-4"
          >
            Signup now !
          </Link>
        </p>
      </form>
    </main>
  );
}
