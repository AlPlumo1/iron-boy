"use client";

import { useActionState } from "react";

import { signUp, type SignUpState } from "@/app/auth/actions";

const initialState: SignUpState = {};

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-bold">Create your IronBoy account</h1>

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
            minLength={8}
            autoComplete="new-password"
            className="rounded border px-3 py-2"
          />
        </label>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        {state.success && (
          <p className="text-sm text-green-600">
            Account created. Check your email to confirm your account.
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isPending ? "Creating account..." : "Create account"}
        </button>
      </form>
    </main>
  );
}
