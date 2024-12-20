import { createContext, ReactNode, useContext, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  isAuthenticated: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (token: string) => {
    console.log("token", token);
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const isAuthenticated = () => !!localStorage.getItem("token");

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
