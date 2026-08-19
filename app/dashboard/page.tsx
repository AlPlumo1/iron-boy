import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div>
        <h1 className="text-2xl font-bold">IronBoy Dashboard</h1>
        <p className="mt-2">Logged in as: {user?.email}</p>
      </div>
    </main>
  );
}
