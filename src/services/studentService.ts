import supabase from "@/config/supabase";

export async function getCurrentStudentId(): Promise<string> {
  // Get logged-in Supabase user
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

  // Find matching student
  const { data: student, error } = await supabase
    .from("students")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  if (!student) {
    throw new Error("Student profile not found.");
  }

  return student.id;
}

export async function getCurrentStudent() {
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

  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return student;
}