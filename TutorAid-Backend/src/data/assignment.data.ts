export type AssignmentStatus =
  | "Pending"
  | "Submitted"
  | "Overdue";

export interface Assignment {
  id: string;
  title: string;
  course: string;
  description: string;
  dueDate: string;
  status: AssignmentStatus;
  maxMarks: number;
  obtainedMarks: number | null;
}

export const assignments: Assignment[] = [
  {
    id: "ai-search-reflection",
    title: "Search Algorithms Reflection",
    course: "Artificial Intelligence",
    description:
      "Compare uninformed and informed search strategies using examples from class.",
    dueDate: "2026-07-08",
    status: "Pending",
    maxMarks: 20,
    obtainedMarks: null,
  },
  {
    id: "ml-model-evaluation",
    title: "Model Evaluation Report",
    course: "Machine Learning",
    description:
      "Prepare a short report explaining precision, recall, F1 score and confusion matrices.",
    dueDate: "2026-07-01",
    status: "Submitted",
    maxMarks: 30,
    obtainedMarks: 26,
  },
  {
    id: "os-process-scheduling",
    title: "Process Scheduling Problems",
    course: "Operating Systems",
    description:
      "Solve the FCFS, SJF and Round Robin scheduling problems shared during lecture.",
    dueDate: "2026-06-28",
    status: "Overdue",
    maxMarks: 25,
    obtainedMarks: null,
  },
];
