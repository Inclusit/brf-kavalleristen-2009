"use client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { SafeUser } from "../types/user";

import LocalStorageKit from "../lib/utils/localStorageKit";
import { User } from "@prisma/client";

type OnComplete = (response?: any) => void;
type OnError = (error?: any) => void;

type UserContextState = {
  token: string | null;
  setToken?: (token: string | null) => void;
  user: SafeUser | null;
  setUser?: (user: SafeUser | null) => void;
  loading?: boolean;
};

const defaultState: UserContextState = {
  token: null,
  setToken: ()=> {},
  user: null,
  loading: true,
};

const UserContext = createContext<Partial<UserContextState>>(defaultState);

function UserProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<typeof defaultState.token>(
    defaultState.token
  );
  const [user, setUser] = useState<typeof defaultState.user>(defaultState.user);
  const [loading, setLoading] = useState<typeof defaultState.loading>(
    defaultState.loading
  );

  useEffect(() => {
    const storedToken = LocalStorageKit.get("@library/token");
    if (storedToken) {
      setToken(storedToken); 
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [token]);

  useEffect(() => {
    const handleStorageChange = () => {
      console.log("Storage event received, updating token and fetching user");
      const updatedToken = LocalStorageKit.get("@library/token");
      setToken(updatedToken); 

      if (!updatedToken) setUser(null); 
      
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const fetchUser = async () => {
    console.log("Fetching user...");
    try {
      const token = LocalStorageKit.get("@library/token");
      console.log("Token from localStorage:", token); 

      if (!token) {
        console.log("No token found. Setting user to null.");
        setUser(null);
        return;
      }
      setLoading(true);
      const response = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetch response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data: SafeUser = await response.json();
      console.log("Fetched user data:", data); // Logga användardata

      setUser(data);
      setLoading(false);
    } catch (error: any) {
      console.warn("Error: Failed to fetch user", error.message);
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        token,
        setToken,
        setUser,
        user,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// use hook
function useUser() {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("'useUser' used outside of provider");
  }
  return user as UserContextState;
}

export { UserProvider, useUser };
