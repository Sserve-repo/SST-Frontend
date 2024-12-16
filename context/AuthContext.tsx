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
  setAuth: (authState: boolean, user?: any | null) => any;
  getCurrentUser: () => any | null;
  getAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  currentUser: null,
  setAuth: () => {},
  getCurrentUser: () => null,
  getAuth: () => false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const isBrowser = typeof window !== "undefined"; // Check if running in the browser

  const getAuthenticatedUser = isBrowser
    ? Cookies.get("isAuthenticated")
    : null;
  const initialAuth = getAuthenticatedUser === "true";

  const storedUser = isBrowser ? localStorage.getItem("currentUser") : null;
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuth);
  const [currentUser, setCurrentUser] = useState<any | null>(initialUser);

  const updateStorage = (authState: boolean, user: any | null): void => {
    if (isBrowser) {
      Cookies.set("isAuthenticated", authState.toString(), {
        secure: true,
        sameSite: "Strict",
      });
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("currentUser");
      }
    }
  };

  const setAuth = async (authState: boolean, user: any | null = null) => {
    console.log("calling in context", authState, user);
    setIsAuthenticated(authState);
    setCurrentUser(user);
    updateStorage(authState, user);
  };

  const getCurrentUser = (): any | null => currentUser;
  const getAuth = (): boolean => isAuthenticated;

  useEffect(() => {
    if (isBrowser) {
      updateStorage(isAuthenticated, currentUser);
    }
  }, [isAuthenticated, currentUser]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        setAuth,
        getCurrentUser,
        getAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
