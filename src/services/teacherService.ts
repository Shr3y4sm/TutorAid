import supabase from "@/config/supabase";

export async function getCurrentTeacherId(): Promise<string> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log("AUTH USER:", user);

  if (authError) {
    console.log("AUTH ERROR:", authError);
    throw authError;
  }

  if (!user) {
    throw new Error("No logged in user.");
  }

  console.log("AUTH USER ID:", user.id);

  const { data, error } = await supabase
    .from("teachers")
    .select("*");

  console.log("TEACHERS:", data);
  console.log("SUPABASE ERROR:", error);

  const teacher = data?.find(
    (t) => t.auth_user_id === user.id
  );

  console.log("MATCHED TEACHER:", teacher);

  if (!teacher) {
    throw new Error("Teacher profile not found.");
  }

  return teacher.id;
}