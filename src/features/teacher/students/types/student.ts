export interface TeacherStudent {
  id:number;
  name:string;
  rollNo:string;
  course:string;
  year:string;
  attendance:number;
  status:string;
}

export interface TeacherStudentsResponse{
  success:boolean;
  data:TeacherStudent[];
}