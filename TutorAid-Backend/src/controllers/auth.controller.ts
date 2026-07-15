import { Request, Response } from "express";
import supabase from "../config/supabase";
import { generateTeacherCode } from "../utils/generateTeacherCode";

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

    const teacherCode =
      await generateTeacherCode(full_name);

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
        experience,
        teacher_code: teacherCode,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from("user_roles").insert({
      auth_user_id,
      role: "teacher",
    });

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

    const { data: teacher, error: teacherError } =
      await supabase
        .from("teachers")
        .select("id")
        .eq("teacher_code", teacher_code)
        .single();

    if (teacherError || !teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

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

    if (studentError) throw studentError;

    const { error: linkError } =
      await supabase
        .from("teacher_students")
        .insert({
          teacher_id: teacher.id,
          student_id: student.id,
        });

    if (linkError) throw linkError;

    await supabase
      .from("user_roles")
      .insert({
        auth_user_id,
        role: "student",
      });

    res.status(201).json({
      success: true,
      data: student,
    });

  } catch (err: any) {
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