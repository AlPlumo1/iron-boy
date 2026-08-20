import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">IronBoy Dashboard</h1>
        <p>Logged in as: {user.email}</p>

        <form action={signOut}>
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white"
          >
            Log out
          </button>
        </form>
      </div>
    </main>
  );
}
