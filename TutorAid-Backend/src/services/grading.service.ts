import supabase from "../config/supabase";

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

    return data;
  }

}