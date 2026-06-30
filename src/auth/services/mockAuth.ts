export type UserRole = "student" | "teacher";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

class MockAuthService {
  async login(
    email: string,
    password: string
  ): Promise<AuthUser> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const role: UserRole =
      email.toLowerCase().includes("teacher")
        ? "teacher"
        : "student";

    return {
      id: "demo-user",
      email,
      role,
    };
  }
}

export default new MockAuthService();