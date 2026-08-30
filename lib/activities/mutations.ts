"use server";

import { revalidatePath } from "next/cache";

import { parseActivityForm } from "@/lib/activities/activity-form";
import { createClient } from "@/lib/supabase/server";

export type CreateActivityState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function createActivity(
  _previousState: CreateActivityState,
  formData: FormData,
): Promise<CreateActivityState> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authenticationError,
  } = await supabase.auth.getUser();

  if (authenticationError || !user) {
    return {
      status: "error",
      message:
        "Votre session a expiré. Reconnectez-vous pour ajouter une activité.",
    };
  }

  const parsedForm = parseActivityForm(formData);

  if (!parsedForm.success) {
    return { status: "error", message: parsedForm.message };
  }

  const { activity, sportDetails, environment } = parsedForm.data;
  const { data: createdActivity, error: activityError } = await supabase
    .from("activities")
    .insert({ ...activity, user_id: user.id })
    .select("id")
    .single();

  if (activityError || !createdActivity) {
    console.error("Unable to create activity", activityError);
    return {
      status: "error",
      message:
        "L’activité n’a pas pu être enregistrée. Réessayez dans un instant.",
    };
  }

  let sportDetailsError: { message: string } | null = null;

  if (sportDetails.table === "running_activities") {
    const { error } = await supabase.from("running_activities").insert({
      activity_id: createdActivity.id,
      ...sportDetails.values,
    });
    sportDetailsError = error;
  } else if (sportDetails.table === "cycling_activities") {
    const { error } = await supabase.from("cycling_activities").insert({
      activity_id: createdActivity.id,
      ...sportDetails.values,
    });
    sportDetailsError = error;
  } else {
    const { error } = await supabase.from("swimming_activities").insert({
      activity_id: createdActivity.id,
      ...sportDetails.values,
    });
    sportDetailsError = error;
  }

  let environmentError: { message: string } | null = null;

  if (!sportDetailsError && environment) {
    const { error } = await supabase.from("activity_environment").insert({
      activity_id: createdActivity.id,
      ...environment,
    });
    environmentError = error;
  }

  if (sportDetailsError || environmentError) {
    console.error(
      "Unable to create activity details",
      sportDetailsError ?? environmentError,
    );

    const { error: cleanupError } = await supabase
      .from("activities")
      .delete()
      .eq("id", createdActivity.id);

    if (cleanupError) {
      console.error("Unable to clean up incomplete activity", cleanupError);
    }

    return {
      status: "error",
      message: "Les détails de l’activité n’ont pas pu être enregistrés.",
    };
  }

  revalidatePath("/dashboard");

  return {
    status: "success",
    message: "Activité ajoutée au récap.",
  };
}
