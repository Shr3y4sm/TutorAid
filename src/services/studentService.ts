import supabase from "@/config/supabase";

export async function getCurrentStudentId(): Promise<string> {
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
    .from("students")
    .select("*");

  console.log("STUDENTS:", data);
  console.log("SUPABASE ERROR:", error);

  const student = data?.find(
    (s: any) => s.auth_user_id === user.id
  );

  console.log("MATCHED STUDENT:", student);

  if (!student) {
    throw new Error("Student profile not found.");
  }

  return student.id;
}