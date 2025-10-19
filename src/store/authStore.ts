import { create } from "zustand";
import { User } from "@/lib/types";
import { getAuthUser, removeAuthCookie, isAuthenticated } from "@/lib/auth";

interface AuthState {
  user: User | null;
  isAuth: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuth: false,
  isAdmin: false,

  setUser: (user) =>
    set({
      user,
      isAuth: !!user,
      isAdmin: user?.role === "admin",
    }),

  refreshUser: () => {
    const currentUser = getAuthUser();
    set({
      user: currentUser,
      isAuth: isAuthenticated(),
      isAdmin: currentUser?.role === "admin",
    });
  },

  logout: () => {
    removeAuthCookie();
    set({
      user: null,
      isAuth: false,
      isAdmin: false,
    });
  },
}));
