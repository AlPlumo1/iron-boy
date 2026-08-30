import { describe, expect, it } from "vitest";

import { parseActivityForm } from "@/lib/activities/activity-form";

function validForm(sport: "running" | "cycling" | "swimming") {
  const formData = new FormData();
  formData.set("sport", sport);
  formData.set("started_at", "2026-08-30T10:30");
  formData.set("timezone_offset_minutes", "-120");
  formData.set("duration_minutes", "45");
  return formData;
}

describe("parseActivityForm", () => {
  it("converts common running fields to database units", () => {
    const formData = validForm("running");
    formData.set("distance_km", "10,5");
    formData.set("avg_cadence_spm", "170");
    formData.set("max_cadence_spm", "184");

    const result = parseActivityForm(formData);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.activity.started_at).toBe("2026-08-30T08:30:00.000Z");
    expect(result.data.activity.duration_seconds).toBe(2700);
    expect(result.data.activity.distance_meters).toBe(10_500);
    expect(result.data.sportDetails).toEqual({
      table: "running_activities",
      values: { avg_cadence_spm: 170, max_cadence_spm: 184 },
    });
  });

  it("requires a pool length for a pool swim", () => {
    const formData = validForm("swimming");
    formData.set("swimming_environment", "pool");

    expect(parseActivityForm(formData)).toEqual({
      success: false,
      message: "La longueur du bassin est requis.",
    });
  });

  it("does not store a pool length for open-water swimming", () => {
    const formData = validForm("swimming");
    formData.set("swimming_environment", "open_water");
    formData.set("pool_length_m", "25");

    const result = parseActivityForm(formData);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.sportDetails).toEqual({
      table: "swimming_activities",
      values: { environment: "open_water", pool_length_m: null },
    });
  });

  it("rejects a maximum heart rate below the average", () => {
    const formData = validForm("cycling");
    formData.set("avg_heart_rate_bpm", "170");
    formData.set("max_heart_rate_bpm", "160");

    expect(parseActivityForm(formData)).toEqual({
      success: false,
      message:
        "La fréquence cardiaque maximale doit être supérieure à la moyenne.",
    });
  });
});
