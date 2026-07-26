import { Request, Response } from "express";
import supabase from "../config/supabase";
import { generateTeacherCode } from "../utils/generateTeacherCode";

/**
 * Safely attempt a rollback delete operation.
 * Logs failures without throwing — the original error is always re-thrown separately.
 */
async function safeRollback(
  table: string,
  column: string,
  value: string
): Promise<void> {
  try {
    await supabase.from(table).delete().eq(column, value);
  } catch (rollbackErr) {
    console.log(`[ROLLBACK FAILED] ${table} delete:`, rollbackErr);
  }
}

export async function registerTeacher(
  req: Request,
  res: Response
) {
  try {
    const {
      auth_user_id,
      full_name,
      email,
      phone,
      subjects,
      designation,
      organization,
      experience,
    } = req.body;
const { data: existingTeacher } =
  await supabase
    .from("teachers")
    .select("id")
    .eq("auth_user_id", auth_user_id)
    .maybeSingle();

if (existingTeacher) {
  return res.status(200).json({
    success: true,
    data: existingTeacher,
    alreadyExists: true,
  });
}
    const teacherCode =
      await generateTeacherCode(full_name);

    const trimmedExperience = experience?.toString().trim() ?? "";
    const parsedExperience = Number(trimmedExperience);
    const experienceValue =
      trimmedExperience === "" ||
      experience == null ||
      Number.isNaN(parsedExperience)
        ? null
        : parsedExperience;

    const { data, error } = await supabase
  .from("teachers")
  .insert({
    auth_user_id,
    full_name,
    email,
    phone,
    subjects,
    designation,
    organization,
    experience: experienceValue,
    teacher_code: teacherCode,
  })
  .select()
  .single();

    if (error) throw error;

    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({
        auth_user_id,
        role: "teacher",
      });

    if (roleError) {
      await safeRollback("teachers", "id", data.id);
      throw roleError;
    }

    res.status(201).json({
      success: true,
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function searchTeacher(
  req: Request,
  res: Response
) {
  try {
    const { code } = req.params;

    const { data, error } = await supabase
      .from("teachers")
      .select(
        "id,full_name,subjects,organization,teacher_code"
      )
      .eq("teacher_code", code)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function registerStudent(
  req: Request,
  res: Response
) {
  try {
    const {
      auth_user_id,
      full_name,
      email,
      phone,
      class: studentClass,
      parent_name,
      parent_phone,
      teacher_code,
    } = req.body;

    // [DIAGNOSTIC] Operation 1: existing student lookup
    const { data: existingStudent, error: existingError } =
  await supabase
    .from("students")
    .select("id")
    .eq("auth_user_id", auth_user_id)
    .maybeSingle();

console.log("[DIAGNOSTIC] existingStudent lookup:", {
  operation: "existing_student_lookup",
  success: !existingError,
  error: existingError,
  data: existingStudent,
});

if (existingStudent) {
  return res.status(200).json({
    success: true,
    data: existingStudent,
    alreadyExists: true,
  });
}

    // [DIAGNOSTIC] Operation 2: teacher lookup
    const { data: teacher, error: teacherError } =
      await supabase
        .from("teachers")
        .select("id")
        .eq("teacher_code", teacher_code)
        .single();

console.log("[DIAGNOSTIC] teacher lookup:", {
  operation: "teacher_lookup",
  success: !teacherError,
  error: teacherError,
  data: teacher,
});

    if (teacherError || !teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

    // [DIAGNOSTIC] Operation 3: students insert
    const { data: student, error: studentError } =
      await supabase
        .from("students")
        .insert({
          auth_user_id,
          full_name,
          email,
          phone,
          class: studentClass,
          parent_name,
          parent_phone,
        })
        .select()
        .single();

console.log("[DIAGNOSTIC] students insert:", {
  operation: "students_insert",
  success: !studentError,
  error: studentError,
  data: student,
});

    if (studentError) throw studentError;

    // [DIAGNOSTIC] Operation 4: teacher_students insert
    const { error: linkError } =
      await supabase
        .from("teacher_students")
        .insert({
          teacher_id: teacher.id,
          student_id: student.id,
        });

console.log("[DIAGNOSTIC] teacher_students insert:", {
  operation: "teacher_students_insert",
  success: !linkError,
  error: linkError,
  data: null,
});

    if (linkError) {
      await safeRollback("students", "id", student.id);
      throw linkError;
    }

    // [DIAGNOSTIC] Operation 5: user_roles insert
    const { data: roleData, error: roleError } =
      await supabase
        .from("user_roles")
        .insert({
          auth_user_id,
          role: "student",
        })
        .select()
        .single();

console.log("[DIAGNOSTIC] user_roles insert:", {
  operation: "user_roles_insert",
  success: !roleError,
  error: roleError,
  data: roleData,
});

if (roleError) {
  await safeRollback("teacher_students", "student_id", student.id);
  await safeRollback("students", "id", student.id);
  throw roleError;
}

    res.status(201).json({
      success: true,
      data: student,
    });

  } catch (err: any) {
    console.log("[DIAGNOSTIC] registerStudent caught error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getUserRole(
  req: Request,
  res: Response
) {
  try {
    const auth_user_id = req.query.auth_user_id as string;

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("auth_user_id", auth_user_id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
      });
    }

    res.json({
      success: true,
      data,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}


export async function getAuthStatus(
  req: Request,
  res: Response
) {
  try {
    const auth_user_id =
      req.query.auth_user_id as string;

    const { data: roleData } =
      await supabase
        .from("user_roles")
        .select("role")
        .eq("auth_user_id", auth_user_id)
        .maybeSingle();

    if (!roleData) {
      return res.json({
        success: true,
        role: null,
        profileExists: false,
      });
    }

    let profileExists = false;

    if (roleData.role === "teacher") {
      const { data } = await supabase
        .from("teachers")
        .select("id")
        .eq("auth_user_id", auth_user_id)
        .maybeSingle();

      profileExists = !!data;
    }

    if (roleData.role === "student") {
      const { data } = await supabase
        .from("students")
        .select("id")
        .eq("auth_user_id", auth_user_id)
        .maybeSingle();

      profileExists = !!data;
    }

    res.json({
      success: true,
      role: roleData.role,
      profileExists,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}