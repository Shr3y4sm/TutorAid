import { create } from "zustand";

interface StudentState {
  attendance: number;

  semester: number;

  branch: string;

  setAttendance: (
    attendance: number
  ) => void;
}

export const useStudentStore =
  create<StudentState>((set) => ({
    attendance: 91,

    semester: 6,

    branch: "Artificial Intelligence & ML",

    setAttendance: (attendance) =>
      set({
        attendance,
      }),
  }));