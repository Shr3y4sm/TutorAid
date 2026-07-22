import supabase from "@/config/supabase";

export async function getCurrentTeacherId(): Promise<string> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) {
    throw new Error("No logged in user.");
  }

  const { data: teacher, error } = await supabase
    .from("teachers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  if (!teacher) {
    throw new Error("Teacher profile not found.");
  }

  return teacher.id;
}

export async function getCurrentTeacher() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) {
    throw new Error("No logged in user.");
  }

  const { data: teacher, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return teacher;
}