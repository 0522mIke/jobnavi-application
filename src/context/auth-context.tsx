"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";

type AuthContextType = {
  isLoggedIn: boolean;
  userEmail: string;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userEmail: '',
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const auth = getAuth(); 
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email || '');
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}