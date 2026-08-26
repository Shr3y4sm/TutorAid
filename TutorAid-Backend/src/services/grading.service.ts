import supabase from "../config/supabase";
import { notifyStudent } from "../utils/notify";

export class GradingService {

  static async gradeSubmission(
    submissionId: string,
    marks: number,
    feedback: string
  ) {

    const { data, error } = await supabase
      .from("assignment_submissions")
      .update({
        marks,
        feedback,
        status: "Graded",
      })
      .eq("id", submissionId)
      .select()
      .single();

    if (error) throw error;

    const { error: assignmentError } =
      await supabase
        .from("assignment_students")
        .update({
          marks,
          feedback,
          status: "Graded",
        })
        .eq("assignment_id", data.assignment_id)
        .eq("student_id", data.student_id);

    if (assignmentError)
      throw assignmentError;

    // Notify the student (fire-and-forget).
    try {
      const { data: assignment } = await supabase
        .from("assignments")
        .select("title")
        .eq("id", data.assignment_id)
        .maybeSingle();

      await notifyStudent(data.student_id, {
        title: "Assignment Graded",
        message:
          `${assignment?.title ?? "Your assignment"} was graded: ${marks} marks.`,
        type: "grading",
      });
    } catch (notifyErr) {
      console.warn(
        "grading notification failed:",
        notifyErr
      );
    }

    return data;
  }

}