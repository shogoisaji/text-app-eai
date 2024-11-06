// src/stores/auth.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  exp: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User, exp: string) => void;
  clearAuth: () => void;
  checkEnabled: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      exp: null,
      isAuthenticated: false,
      setAuth: (token, user, exp) => {
        localStorage.setItem("auth-token", token);
        set({ token, user, exp, isAuthenticated: true });
      },
      checkEnabled: () => {
        const enabled = (): boolean => {
          const { exp, user } = get();
          if (!exp) return false;
          const expDate = new Date(exp);
          const now = new Date();
          const diff = expDate.getTime() - now.getTime();
          if (diff > 0 && user?.role === "admin") {
            return true;
          }
          return false;
        };

        if (!enabled()) {
          localStorage.removeItem("auth-token");
          set({ token: null, user: null, exp: null, isAuthenticated: false });
        }
      },
      clearAuth: () => {
        localStorage.removeItem("auth-token");
        set({ token: null, user: null, exp: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
