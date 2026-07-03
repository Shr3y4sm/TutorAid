import { api } from "./client";
import { TeacherStudentsResponse } from "@/features/teacher/students/types/student";

export async function getTeacherStudents(){
    const response =
        await api<TeacherStudentsResponse>(
            "/teacher/students"
        );

    return response.data;
}