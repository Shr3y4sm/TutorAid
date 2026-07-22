import supabase from "../config/supabase";

export class AssignmentService {

  static async getAssignments(
    teacherId: string
  ) {
    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    return data;
  }

  static async createAssignment(payload: {
    teacher_id: string;
    title: string;
    description: string;
    subject: string;
    due_date: string;
    max_marks: number;
    students: string[];
    file_url?: string;
  }) {

    const {
      teacher_id,
      title,
      description,
      subject,
      due_date,
      max_marks,
      students,
      file_url,
    } = payload;

    const { data: assignment, error } =
      await supabase
        .from("assignments")
        .insert({
          teacher_id,
          title,
          description,
          subject,
          due_date,
          max_marks,
          file_url,
          status: "Active",
        })
        .select()
        .single();

    if (error) throw error;

    if (students.length > 0) {

      const assignmentStudents =
        students.map(studentId => ({
          assignment_id: assignment.id,
          student_id: studentId,
        }));

      const { error: assignmentError } =
        await supabase
          .from("assignment_students")
          .insert(assignmentStudents);

      if (assignmentError)
        throw assignmentError;

      const notifications =
        students.map(studentId => ({
          student_id: studentId,
          teacher_id,
          title: "New Assignment",
          message: `${title} has been assigned.`,
          type: "assignment",
        }));

      const { error: notificationError } =
        await supabase
          .from("notifications")
          .insert(notifications);

      if (notificationError)
        throw notificationError;
    }

    return assignment;
  }

  static async updateAssignment(
    assignmentId: string,
    payload: {
      title: string;
      description: string;
      subject: string;
      due_date: string;
      max_marks: number;
    }
  ) {

    const { data, error } =
      await supabase
        .from("assignments")
        .update(payload)
        .eq("id", assignmentId)
        .select()
        .single();

    if (error) throw error;

    return data;
  }

  static async deleteAssignment(
    assignmentId: string
  ) {

    await supabase
      .from("assignment_students")
      .delete()
      .eq("assignment_id", assignmentId);

    const { error } =
      await supabase
        .from("assignments")
        .delete()
        .eq("id", assignmentId);

    if (error) throw error;
  }

  static async getAssignmentStudents(
    assignmentId: string
  ) {

    const { data, error } =
      await supabase
        .from("assignment_students")
        .select(`
          id,
          status,
          marks,
          feedback,
          submitted_at,
          student:students(
            id,
            full_name,
            class,
            roll_no
          )
        `)
        .eq("assignment_id", assignmentId);

    if (error) throw error;

    return data;
  }

  static async submitAssignment(
    assignmentId: string,
    payload: {
      student_id: string;
      file_url: string;
    }
  ) {

    const { student_id, file_url } =
      payload;

    const { error: submissionError } =
      await supabase
        .from("assignment_submissions")
        .upsert({
          assignment_id: assignmentId,
          student_id,
          file_url,
          status: "Submitted",
        });

    if (submissionError)
      throw submissionError;

    const { error: statusError } =
      await supabase
        .from("assignment_students")
        .update({
          status: "Submitted",
          submitted_at:
            new Date().toISOString(),
        })
        .eq("assignment_id", assignmentId)
        .eq("student_id", student_id);

    if (statusError)
      throw statusError;
  }

}