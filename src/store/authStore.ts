import { create } from "zustand";

interface User {
  id: string;
  name: string;
  role: "student" | "teacher";
}

interface AuthStore {
  user: User | null;

  login: (user: User) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthStore>((set) => ({
    user: null,

    login: (user) =>
      set({
        user,
      }),

    logout: () =>
      set({
        user: null,
      }),
  }));
  