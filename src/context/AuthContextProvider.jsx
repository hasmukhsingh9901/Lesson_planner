"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

 const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password) => 
    (email === "demouser@gmail.com" && password === "demopass") ? 
      setIsAuthenticated(true) : 
      false;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider


export const useAuth = () => useContext(AuthContext);


