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
  setAuth: (authState: boolean, user: any | null, token: string | null) => any;
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
  // secure: process.env.NODE_ENV === "production",
  secure: false,
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

      if (
        (authData === "true" || authData) &&
        accessToken &&
        currentUserData
      ) {
        try {
          const userData = JSON.parse(currentUserData);
          setCurrentUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // console.error("Error parsing user data:", error);
          // Cookies.remove("isAuthenticated", { path: "/" });
          // Cookies.remove("accessToken", { path: "/" });
          // Cookies.remove("currentUser", { path: "/" });
          // setCurrentUser(null);
          // setIsAuthenticated(false);
        }
      } else {
        // Cookies.remove("isAuthenticated", { path: "/" });
        // Cookies.remove("accessToken", { path: "/" });
        // Cookies.remove("currentUser", { path: "/" });
        // setCurrentUser(null);
        // setIsAuthenticated(false);
      }
    };

    initAuth();
  }, []);

  const setAuth = async (
    authState: boolean,
    user: any | null = null,
    token: string | null
  ) => {
    if (authState && user && token) {
      // Set the cookie to expire in 10 hours
      localStorage.setItem("email", JSON.stringify(user.email));
      Cookies.set("isAuthenticated", "true", COOKIE_OPTIONS);
      Cookies.set("currentUser", JSON.stringify(user), COOKIE_OPTIONS);
      Cookies.set("accessToken", token, COOKIE_OPTIONS);
      setIsAuthenticated(true);
      setCurrentUser(user);
    } else {
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("isAuthenticated", { path: "/" });
      Cookies.remove("currentUser", { path: "/" });
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  const getCurrentUser = (): any | null => currentUser;
  const getAuth = (): boolean => isAuthenticated;

  const logOut = () => {
    setAuth(false, null, null);
    localStorage.removeItem("email");
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
