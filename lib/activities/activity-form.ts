import type {
  ActivityEnvironmentInsert,
  ActivityFeeling,
  ActivityInsert,
  ActivitySport,
  ActivityWeather,
  CyclingActivityInsert,
  RunningActivityInsert,
  SwimmingActivityInsert,
} from "@/lib/activities/types";

const sports = ["running", "cycling", "swimming"] as const;
const feelings = [
  "very_easy",
  "easy",
  "moderate",
  "hard",
  "very_hard",
] as const;
const weatherValues = [
  "sunny",
  "partly_sunny",
  "rainy",
  "foggy",
  "snowy",
  "stormy",
  "overcast",
] as const;

type ParsedSportDetails =
  | {
      table: "running_activities";
      values: Omit<RunningActivityInsert, "activity_id">;
    }
  | {
      table: "cycling_activities";
      values: Omit<CyclingActivityInsert, "activity_id">;
    }
  | {
      table: "swimming_activities";
      values: Omit<SwimmingActivityInsert, "activity_id">;
    };

export type ParsedActivityForm = {
  activity: Omit<ActivityInsert, "user_id">;
  environment: Omit<ActivityEnvironmentInsert, "activity_id"> | null;
  sportDetails: ParsedSportDetails;
};

export type ActivityFormResult =
  | { success: true; data: ParsedActivityForm }
  | { success: false; message: string };

class FormValidationError extends Error {}

function stringValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(
  formData: FormData,
  name: string,
  label: string,
  options: {
    required?: boolean;
    integer?: boolean;
    min?: number;
    max?: number;
  } = {},
) {
  const rawValue = stringValue(formData, name);

  if (!rawValue) {
    if (options.required) {
      throw new FormValidationError(`${label} est requis.`);
    }

    return null;
  }

  const value = Number(rawValue.replace(",", "."));

  if (!Number.isFinite(value)) {
    throw new FormValidationError(`${label} doit être un nombre valide.`);
  }

  if (options.integer && !Number.isInteger(value)) {
    throw new FormValidationError(`${label} doit être un nombre entier.`);
  }

  if (options.min !== undefined && value < options.min) {
    throw new FormValidationError(
      `${label} doit être supérieur ou égal à ${options.min}.`,
    );
  }

  if (options.max !== undefined && value > options.max) {
    throw new FormValidationError(
      `${label} doit être inférieur ou égal à ${options.max}.`,
    );
  }

  return value;
}

function enumValue<T extends string>(
  formData: FormData,
  name: string,
  values: readonly T[],
  label: string,
  required = false,
) {
  const value = stringValue(formData, name);

  if (!value && !required) {
    return null;
  }

  if (!values.includes(value as T)) {
    throw new FormValidationError(`${label} est invalide.`);
  }

  return value as T;
}

function localDateTimeToIso(value: string, timezoneOffset: number) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);

  if (!match) {
    throw new FormValidationError("La date et l’heure sont invalides.");
  }

  const [, yearText, monthText, dayText, hourText, minuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const localAsUtc = new Date(Date.UTC(year, month - 1, day, hour, minute));

  if (
    localAsUtc.getUTCFullYear() !== year ||
    localAsUtc.getUTCMonth() !== month - 1 ||
    localAsUtc.getUTCDate() !== day ||
    localAsUtc.getUTCHours() !== hour ||
    localAsUtc.getUTCMinutes() !== minute
  ) {
    throw new FormValidationError("La date et l’heure sont invalides.");
  }

  return new Date(localAsUtc.getTime() + timezoneOffset * 60_000).toISOString();
}

function validateMaximumAtLeastAverage(
  average: number | null,
  maximum: number | null,
  label: string,
) {
  if (average !== null && maximum !== null && maximum < average) {
    throw new FormValidationError(
      `${label} maximale doit être supérieure à la moyenne.`,
    );
  }
}

export function parseActivityForm(formData: FormData): ActivityFormResult {
  try {
    const sport = enumValue(
      formData,
      "sport",
      sports,
      "Le type d’activité",
      true,
    ) as ActivitySport;
    const timezoneOffset = numberValue(
      formData,
      "timezone_offset_minutes",
      "Le fuseau horaire",
      { required: true, integer: true, min: -840, max: 840 },
    )!;
    const startedAt = localDateTimeToIso(
      stringValue(formData, "started_at"),
      timezoneOffset,
    );
    const durationMinutes = numberValue(
      formData,
      "duration_minutes",
      "La durée",
      { required: true, min: 1 },
    )!;
    const distanceKm = numberValue(formData, "distance_km", "La distance", {
      min: 0,
    });
    const averageHeartRate = numberValue(
      formData,
      "avg_heart_rate_bpm",
      "La fréquence cardiaque moyenne",
      { integer: true, min: 1, max: 300 },
    );
    const maximumHeartRate = numberValue(
      formData,
      "max_heart_rate_bpm",
      "La fréquence cardiaque maximale",
      { integer: true, min: 1, max: 300 },
    );
    const calories = numberValue(formData, "calories", "Les calories", {
      integer: true,
      min: 0,
      max: 9999,
    });
    const feeling = enumValue(
      formData,
      "feeling",
      feelings,
      "La sensation",
    ) as ActivityFeeling | null;
    const comment = stringValue(formData, "comment");

    validateMaximumAtLeastAverage(
      averageHeartRate,
      maximumHeartRate,
      "La fréquence cardiaque",
    );

    if (comment.length > 2_000) {
      throw new FormValidationError(
        "Le commentaire ne peut pas dépasser 2000 caractères.",
      );
    }

    const elevationGain = numberValue(
      formData,
      "elevation_gain_m",
      "Le dénivelé positif",
      { min: 0 },
    );
    const temperature = numberValue(
      formData,
      "temperature_c",
      "La température",
      { min: -100, max: 100 },
    );
    const weather = enumValue(
      formData,
      "weather",
      weatherValues,
      "La météo",
    ) as ActivityWeather | null;
    const environment =
      elevationGain !== null || temperature !== null || weather !== null
        ? {
            elevation_gain_m: elevationGain,
            temperature_c: temperature,
            weather,
          }
        : null;

    let sportDetails: ParsedSportDetails;

    if (sport === "running") {
      const averageCadence = numberValue(
        formData,
        "avg_cadence_spm",
        "La cadence moyenne",
        { integer: true, min: 1 },
      );
      const maximumCadence = numberValue(
        formData,
        "max_cadence_spm",
        "La cadence maximale",
        { integer: true, min: 1 },
      );

      validateMaximumAtLeastAverage(
        averageCadence,
        maximumCadence,
        "La cadence",
      );
      sportDetails = {
        table: "running_activities",
        values: {
          avg_cadence_spm: averageCadence,
          max_cadence_spm: maximumCadence,
        },
      };
    } else if (sport === "cycling") {
      const averageCadence = numberValue(
        formData,
        "avg_cadence_rpm",
        "La cadence moyenne",
        { integer: true, min: 1 },
      );
      const maximumCadence = numberValue(
        formData,
        "max_cadence_rpm",
        "La cadence maximale",
        { integer: true, min: 1 },
      );
      const averagePower = numberValue(
        formData,
        "avg_power_w",
        "La puissance moyenne",
        { integer: true, min: 0 },
      );
      const maximumPower = numberValue(
        formData,
        "max_power_w",
        "La puissance maximale",
        { integer: true, min: 0 },
      );

      validateMaximumAtLeastAverage(
        averageCadence,
        maximumCadence,
        "La cadence",
      );
      validateMaximumAtLeastAverage(averagePower, maximumPower, "La puissance");
      sportDetails = {
        table: "cycling_activities",
        values: {
          avg_cadence_rpm: averageCadence,
          max_cadence_rpm: maximumCadence,
          avg_power_w: averagePower,
          max_power_w: maximumPower,
        },
      };
    } else {
      const swimmingEnvironment = enumValue(
        formData,
        "swimming_environment",
        ["pool", "open_water"] as const,
        "L’environnement de nage",
        true,
      )!;
      const poolLength =
        swimmingEnvironment === "pool"
          ? numberValue(formData, "pool_length_m", "La longueur du bassin", {
              required: true,
              integer: true,
              min: 1,
            })
          : null;

      sportDetails = {
        table: "swimming_activities",
        values: {
          environment: swimmingEnvironment,
          pool_length_m: poolLength,
        },
      };
    }

    return {
      success: true,
      data: {
        activity: {
          sport,
          started_at: startedAt,
          duration_seconds: Math.round(durationMinutes * 60),
          distance_meters:
            distanceKm === null ? null : Math.round(distanceKm * 1000),
          avg_heart_rate_bpm: averageHeartRate,
          max_heart_rate_bpm: maximumHeartRate,
          calories,
          feeling,
          comment: comment || null,
          source: "manual",
        },
        environment,
        sportDetails,
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof FormValidationError
          ? error.message
          : "Les informations saisies sont invalides.",
    };
  }
}
