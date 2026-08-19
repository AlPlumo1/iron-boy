import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-4">
        {user ? (
          <>
            <p>Logged in as: {user.email}</p>

            <form action={signOut}>
              <button
                type="submit"
                className="rounded bg-black px-4 py-2 text-white"
              >
                Log out
              </button>
            </form>
          </>
        ) : (
          <p>Not authenticated</p>
        )}
      </div>
    </main>
  );
}
