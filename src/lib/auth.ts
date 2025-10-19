import Cookies from "js-cookie";
import { User } from "./types";

export const setAuthCookie = (token: string, user: User) => {
  Cookies.set("token", token, { expires: 7 }); // 7 days
  Cookies.set("user", JSON.stringify(user), { expires: 7 });
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get("token");
};

export const getAuthUser = (): User | null => {
  const userStr = Cookies.get("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const removeAuthCookie = () => {
  Cookies.remove("token");
  Cookies.remove("user");
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const isAdmin = (): boolean => {
  const user = getAuthUser();
  return user?.role === "admin";
};
