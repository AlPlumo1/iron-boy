import { getActivities } from "@/lib/activities/queries";

export default async function DashboardPage() {
  const activities = await getActivities();

  return (
    <main className="p-8">
      <pre>{JSON.stringify(activities, null, 2)}</pre>
    </main>
  );
}
