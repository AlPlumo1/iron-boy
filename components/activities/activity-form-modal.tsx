"use client";

import Image from "next/image";
import { useActionState, useEffect, useState, type ReactNode } from "react";

import {
  createActivity,
  type CreateActivityState,
} from "@/lib/activities/mutations";
import type { ActivitySport } from "@/lib/activities/types";

import styles from "./activity-form-modal.module.css";

const initialActionState: CreateActivityState = { status: "idle" };

const sportMetadata: Record<
  ActivitySport,
  {
    title: string;
    distancePlaceholder: string;
    durationPlaceholder: string;
  }
> = {
  running: {
    title: "Nouvelle course",
    distancePlaceholder: "10",
    durationPlaceholder: "45",
  },
  cycling: {
    title: "Nouvelle sortie vélo",
    distancePlaceholder: "40",
    durationPlaceholder: "90",
  },
  swimming: {
    title: "Nouvelle séance de nage",
    distancePlaceholder: "2",
    durationPlaceholder: "45",
  },
};

type ActivityFormModalProps = {
  sport: ActivitySport;
  startedAt: string;
  onClose: () => void;
  onSaved: (message: string) => void;
};

function BackArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 42 24">
      <path d="M13 3 3 12l10 9" />
      <path d="M4 12h35" />
    </svg>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 34 34">
      <path d="M17 0c.9 10.8 6.2 16.1 17 17-10.8.9-16.1 6.2-17 17C16.1 23.2 10.8 17.9 0 17 10.8 16.1 16.1 10.8 17 0Z" />
    </svg>
  );
}

function FormField({
  label,
  hint,
  children,
  fullWidth = false,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <label className={fullWidth ? styles.fullWidthField : styles.field}>
      <span>
        {label}
        {hint && <small>{hint}</small>}
      </span>
      {children}
    </label>
  );
}

function SportFields({
  sport,
  swimmingEnvironment,
  onSwimmingEnvironmentChange,
}: {
  sport: ActivitySport;
  swimmingEnvironment: "pool" | "open_water";
  onSwimmingEnvironmentChange: (value: "pool" | "open_water") => void;
}) {
  if (sport === "running") {
    return (
      <>
        <FormField label="Cadence moyenne" hint="pas/min">
          <input
            className={styles.input}
            name="avg_cadence_spm"
            type="number"
            inputMode="numeric"
            min="1"
          />
        </FormField>
        <FormField label="Cadence maximale" hint="pas/min">
          <input
            className={styles.input}
            name="max_cadence_spm"
            type="number"
            inputMode="numeric"
            min="1"
          />
        </FormField>
      </>
    );
  }

  if (sport === "cycling") {
    return (
      <>
        <FormField label="Cadence moyenne" hint="tr/min">
          <input
            className={styles.input}
            name="avg_cadence_rpm"
            type="number"
            inputMode="numeric"
            min="1"
          />
        </FormField>
        <FormField label="Cadence maximale" hint="tr/min">
          <input
            className={styles.input}
            name="max_cadence_rpm"
            type="number"
            inputMode="numeric"
            min="1"
          />
        </FormField>
        <FormField label="Puissance moyenne" hint="watts">
          <input
            className={styles.input}
            name="avg_power_w"
            type="number"
            inputMode="numeric"
            min="0"
          />
        </FormField>
        <FormField label="Puissance maximale" hint="watts">
          <input
            className={styles.input}
            name="max_power_w"
            type="number"
            inputMode="numeric"
            min="0"
          />
        </FormField>
      </>
    );
  }

  return (
    <>
      <FormField label="Environnement">
        <select
          className={styles.input}
          name="swimming_environment"
          value={swimmingEnvironment}
          onChange={(event) =>
            onSwimmingEnvironmentChange(
              event.target.value as "pool" | "open_water",
            )
          }
        >
          <option value="pool">Piscine</option>
          <option value="open_water">Eau libre</option>
        </select>
      </FormField>
      {swimmingEnvironment === "pool" && (
        <FormField label="Longueur du bassin" hint="mètres">
          <input
            className={styles.input}
            name="pool_length_m"
            type="number"
            inputMode="numeric"
            min="1"
            defaultValue="25"
            required
          />
        </FormField>
      )}
    </>
  );
}

export function ActivityFormModal({
  sport,
  startedAt,
  onClose,
  onSaved,
}: ActivityFormModalProps) {
  const [state, formAction, isPending] = useActionState(
    createActivity,
    initialActionState,
  );
  const [swimmingEnvironment, setSwimmingEnvironment] = useState<
    "pool" | "open_water"
  >("pool");
  const metadata = sportMetadata[sport];

  useEffect(() => {
    if (state.status === "success") {
      onSaved(state.message ?? "Activité ajoutée au récap.");
    }
  }, [onSaved, state]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPending, onClose]);

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          onClose();
        }
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-form-title"
      >
        <Image
          aria-hidden="true"
          alt=""
          className={styles.backgroundMark}
          src="/IRON_Final.png"
          width={2924}
          height={2224}
          draggable={false}
        />

        <header className={styles.header}>
          <button
            type="button"
            className={styles.backButton}
            onClick={onClose}
            disabled={isPending}
            aria-label="Fermer le formulaire d’activité"
            title="Revenir au récap"
            autoFocus
          >
            <BackArrow />
          </button>

          <h2 id="activity-form-title">
            {metadata.title}
            <Sparkle className={styles.titleSparkle} />
          </h2>
        </header>

        <form action={formAction} className={styles.form} aria-busy={isPending}>
          <input type="hidden" name="sport" value={sport} />
          <input
            type="hidden"
            name="timezone_offset_minutes"
            value={new Date().getTimezoneOffset()}
          />

          <fieldset className={styles.formGrid}>
            <legend>Essentiel</legend>
            <FormField label="Date et heure">
              <input
                className={styles.input}
                name="started_at"
                type="datetime-local"
                defaultValue={startedAt}
                required
              />
            </FormField>
            <FormField label="Durée" hint="minutes">
              <input
                className={styles.input}
                name="duration_minutes"
                type="number"
                inputMode="decimal"
                min="1"
                step="1"
                placeholder={metadata.durationPlaceholder}
                required
              />
            </FormField>
            <FormField label="Distance" hint="kilomètres">
              <input
                className={styles.input}
                name="distance_km"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder={metadata.distancePlaceholder}
              />
            </FormField>
            <FormField label="Sensation">
              <select className={styles.input} name="feeling" defaultValue="">
                <option value="">Non renseignée</option>
                <option value="very_easy">Très facile</option>
                <option value="easy">Facile</option>
                <option value="moderate">Modérée</option>
                <option value="hard">Difficile</option>
                <option value="very_hard">Très difficile</option>
              </select>
            </FormField>
          </fieldset>

          <fieldset className={styles.formGrid}>
            <legend>
              {sport === "swimming" ? "Données de nage" : "Données sportives"}
            </legend>
            <FormField label="Calories" hint="kcal">
              <input
                className={styles.input}
                name="calories"
                type="number"
                inputMode="numeric"
                min="0"
                max="9999"
              />
            </FormField>
            <FormField label="FC moyenne" hint="bpm">
              <input
                className={styles.input}
                name="avg_heart_rate_bpm"
                type="number"
                inputMode="numeric"
                min="1"
                max="300"
              />
            </FormField>
            <FormField label="FC maximale" hint="bpm">
              <input
                className={styles.input}
                name="max_heart_rate_bpm"
                type="number"
                inputMode="numeric"
                min="1"
                max="300"
              />
            </FormField>
            <SportFields
              sport={sport}
              swimmingEnvironment={swimmingEnvironment}
              onSwimmingEnvironmentChange={setSwimmingEnvironment}
            />
          </fieldset>

          <details className={styles.optionalSection}>
            <summary>
              Conditions extérieures <span>optionnel</span>
            </summary>
            <div className={styles.formGrid}>
              <FormField label="Dénivelé positif" hint="mètres">
                <input
                  className={styles.input}
                  name="elevation_gain_m"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                />
              </FormField>
              <FormField label="Température" hint="°C">
                <input
                  className={styles.input}
                  name="temperature_c"
                  type="number"
                  inputMode="decimal"
                  min="-100"
                  max="100"
                  step="0.1"
                />
              </FormField>
              <FormField label="Météo" fullWidth>
                <select className={styles.input} name="weather" defaultValue="">
                  <option value="">Non renseignée</option>
                  <option value="sunny">Ensoleillé</option>
                  <option value="partly_sunny">Éclaircies</option>
                  <option value="overcast">Couvert</option>
                  <option value="rainy">Pluie</option>
                  <option value="foggy">Brouillard</option>
                  <option value="snowy">Neige</option>
                  <option value="stormy">Orage</option>
                </select>
              </FormField>
            </div>
          </details>

          <FormField label="Commentaire" fullWidth>
            <textarea
              className={styles.textarea}
              name="comment"
              rows={3}
              maxLength={2_000}
              placeholder="Quelques mots sur la séance…"
            />
          </FormField>

          {state.status === "error" && (
            <p className={styles.formError} role="alert">
              {state.message}
            </p>
          )}

          <footer className={styles.actions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isPending}
            >
              <Sparkle className={styles.submitSparkle} />
              <span>{isPending ? "Ajout…" : "Valider"}</span>
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
