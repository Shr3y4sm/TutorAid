export interface AuthUser {
  id: string;
  email: string;
  role: "teacher" | "student" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}