import supabase from "../config/supabase";

export async function generateTeacherCode(
  fullName: string
): Promise<string> {
  const firstName = fullName
    .trim()
    .split(" ")[0]
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  while (true) {
    const random = Math.floor(
      100 + Math.random() * 900
    );

    const code = `${firstName}${random}`;

    const { data } = await supabase
      .from("teachers")
      .select("id")
      .eq("teacher_code", code)
      .maybeSingle();

    if (!data) {
      return code;
    }
  }
}