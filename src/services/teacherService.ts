import supabase from "@/config/supabase";

export async function getCurrentTeacherId(): Promise<string> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not logged in.");
  }

  const { data, error } = await supabase
    .from("teachers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !data) {
    throw new Error("Teacher profile not found.");
  }

  return data.id;
}