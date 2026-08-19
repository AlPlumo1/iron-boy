import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div>
        {user ? <p>Logged in as: {user.email}</p> : <p>Not authenticated</p>}
      </div>
    </main>
  );
}
