"use client";

import { useCallback, useEffect, useState } from "react";

import { ActivityFormModal } from "@/components/activities/activity-form-modal";
import type { Activity, ActivitySport } from "@/lib/activities/types";

import styles from "./recap.module.css";

type ActivitySection = {
  sport: ActivitySport;
  label: string;
  activities: Activity[];
};

function formatActivity(activity: Activity) {
  const date = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Paris",
  }).format(new Date(activity.started_at));
  const minutes = Math.max(1, Math.round(activity.duration_seconds / 60));
  const duration =
    minutes >= 60
      ? `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")}`
      : `${minutes} min`;
  const distance = activity.distance_meters
    ? `${(activity.distance_meters / 1000).toLocaleString("fr-FR", {
        maximumFractionDigits: 1,
      })} km`
    : null;

  return [date, distance, duration].filter(Boolean).join(" · ");
}

function toLocalDateTimeValue(date: Date) {
  const offsetDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );
  return offsetDate.toISOString().slice(0, 16);
}

function ActivityCard({
  section,
  onAdd,
}: {
  section: ActivitySection;
  onAdd: (sport: ActivitySport) => void;
}) {
  return (
    <article className={styles.card} tabIndex={0}>
      <header className={styles.cardHeader}>
        <h2>{section.label}</h2>
        <button
          type="button"
          className={styles.addIcon}
          aria-label={`Ajouter une activité ${section.label.toLowerCase()}`}
          onClick={() => onAdd(section.sport)}
        >
          +
        </button>
      </header>

      <ul className={styles.activityList}>
        {section.activities.length > 0 ? (
          section.activities.map((activity) => (
            <li key={activity.id} className={styles.activity}>
              {formatActivity(activity)}
            </li>
          ))
        ) : (
          <li className={styles.emptyState}>Aucune activité récente</li>
        )}
      </ul>
    </article>
  );
}

export function ActivityCards({ sections }: { sections: ActivitySection[] }) {
  const [openSport, setOpenSport] = useState<ActivitySport | null>(null);
  const [startedAt, setStartedAt] = useState("");
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const closeModal = useCallback(() => setOpenSport(null), []);
  const handleSaved = useCallback((message: string) => {
    setOpenSport(null);
    setConfirmation(message);
  }, []);

  useEffect(() => {
    if (!confirmation) return;

    const timeout = window.setTimeout(() => setConfirmation(null), 3_500);
    return () => window.clearTimeout(timeout);
  }, [confirmation]);

  const openModal = (sport: ActivitySport) => {
    setStartedAt(toLocalDateTimeValue(new Date()));
    setOpenSport(sport);
    setConfirmation(null);
  };

  return (
    <>
      <section
        aria-label="Activités récentes par sport"
        className={styles.cards}
      >
        {sections.map((section) => (
          <ActivityCard
            key={section.sport}
            section={section}
            onAdd={openModal}
          />
        ))}
      </section>

      {openSport && (
        <ActivityFormModal
          key={openSport}
          sport={openSport}
          startedAt={startedAt}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}

      {confirmation && (
        <p className={styles.toast} role="status">
          {confirmation}
        </p>
      )}
    </>
  );
}
