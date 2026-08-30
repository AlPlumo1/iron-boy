import { getActivities } from "@/lib/activities/queries";
import { ActivityCards } from "./activity-cards";

const activitySections = [
  { sport: "running", label: "Course" },
  { sport: "cycling", label: "Vélo" },
  { sport: "swimming", label: "Nage" },
] as const;

function BrandSparkles() {
  return (
    <svg aria-hidden="true" className="h-14 w-16" viewBox="0 0 64 64">
      <path
        d="m21 0 5 16 16 5-16 5-5 16-5-16-16-5 16-5L21 0Z"
        fill="currentColor"
      />
      <path
        d="m46 11 4 12 12 4-12 4-4 12-4-12-12-4 12-4 4-12Z"
        fill="currentColor"
      />
      <path
        d="m30 30 4 11 11 4-11 4-4 11-4-11-11-4 11-4 4-11Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SmallSparkle() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20">
      <path d="m10 0 2 8 8 2-8 2-2 8-2-8-8-2 8-2 2-8Z" fill="currentColor" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-16 w-16 text-violet-500"
      viewBox="0 0 64 64"
    >
      <circle cx="32" cy="32" r="17" fill="currentColor" />
      {Array.from({ length: 12 }, (_, index) => (
        <line
          key={index}
          x1="32"
          y1="2"
          x2="32"
          y2="10"
          stroke="currentColor"
          strokeWidth="2"
          transform={`rotate(${index * 30} 32 32)`}
        />
      ))}
    </svg>
  );
}

export default async function DashboardPage() {
  const activities = await getActivities();

  return (
    <main className="flex min-h-svh flex-col overflow-x-hidden bg-black text-white">
      <header className="relative flex min-h-40 items-start px-5 pt-4 sm:px-8 md:min-h-28 lg:px-5">
        <div className="text-white" aria-label="IronBoy">
          <BrandSparkles />
        </div>

        <nav
          aria-label="Navigation principale"
          className="absolute top-24 left-1/2 flex w-[calc(100%-3rem)] max-w-[820px] -translate-x-1/2 items-center justify-between text-base uppercase sm:text-xl md:top-4 md:w-[68%] lg:text-2xl"
        >
          <span className="relative flex h-16 w-32 items-center justify-center md:h-[74px] md:w-[158px]">
            <span className="absolute inset-x-0 inset-y-2 -rotate-[11deg] rounded-[50%] border border-white" />
            <span className="absolute top-[25px] left-1 text-white">
              <SmallSparkle />
            </span>
            <span className="relative">Récap</span>
          </span>
          <span>Plan</span>
          <span>Santé</span>
        </nav>

        <div className="absolute top-2 right-4 flex flex-col items-center sm:right-6">
          <SunIcon />
          <span className="-mt-1 text-xl sm:text-2xl">29°C</span>
        </div>
      </header>

      <ActivityCards
        sections={activitySections.map(({ sport, label }) => ({
          sport,
          label,
          activities: activities
            .filter((activity) => activity.sport === sport)
            .slice(0, 5),
        }))}
      />
    </main>
  );
}
