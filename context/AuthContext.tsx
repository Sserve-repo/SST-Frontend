"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: any | null;
  setAuth: (
    authState: boolean,
    user: any | null,
    token?: string | null
  ) => void;
  getCurrentUser: () => any | null;
  getAuth: () => boolean;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  currentUser: null,
  setAuth: () => {},
  getCurrentUser: () => null,
  getAuth: () => false,
  logOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

const hoursToDays = (hours: number): number => hours / 24;
export const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: hoursToDays(16),
  path: "/",
  secure: false, // Change to true in production
  sameSite: "Lax",
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const isBrowser = typeof window !== "undefined";

  const getAuthenticatedUser = isBrowser
    ? Cookies.get("isAuthenticated")
    : null;
  const initialAuth = getAuthenticatedUser === "true";

  const storedUser = isBrowser ? localStorage.getItem("currentUser") : null;
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuth);
  const [currentUser, setCurrentUser] = useState<any | null>(initialUser);

  useEffect(() => {
    const initAuth = () => {
      const authData = Cookies.get("isAuthenticated");
      const accessToken = Cookies.get("accessToken");
      const currentUserData = Cookies.get("currentUser");

      if (authData === "true" && accessToken && currentUserData) {
        try {
          const userData = JSON.parse(currentUserData);
          setCurrentUser(userData);
          setIsAuthenticated(true);
        } catch {
          // Clear invalid cookies
          Cookies.remove("isAuthenticated");
          Cookies.remove("accessToken");
          Cookies.remove("currentUser");
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      }
    };

    initAuth();
  }, []);

  const setAuth = (
    authState: boolean,
    user: any | null = null,
    token: string | null = Cookies.get("accessToken") ?? null
  ) => {
    if (authState && user && token) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      Cookies.set("isAuthenticated", "true", COOKIE_OPTIONS);
      Cookies.set("accessToken", token, COOKIE_OPTIONS);
      Cookies.set("currentUser", JSON.stringify(user), COOKIE_OPTIONS);
      setIsAuthenticated(true);
      setCurrentUser(user);
    } else {
      localStorage.removeItem("currentUser");
      Cookies.remove("isAuthenticated");
      Cookies.remove("accessToken");
      Cookies.remove("currentUser");
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  const getCurrentUser = (): any | null => currentUser;
  const getAuth = (): boolean => isAuthenticated;

  const logOut = () => {
    setAuth(false, null, null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        setAuth,
        getCurrentUser,
        getAuth,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
