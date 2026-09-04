"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import React, { createContext, useCallback, useEffect, useState } from "react";

type userType = {
  name: string;
  email: string;
  id: string;
  image?: string;
};

type userContextType = {
  user: userType | null;
  setUser: (user: userType | null) => void;
  refetchUser: () => Promise<void>;
};

export const userDataContext = createContext<userContextType | undefined>(
  undefined,
);

const UserContext = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<userType | null>(null);
  const { status } = useSession();

  const FetchUser = useCallback(async () => {
    try {
      const result = await axios.get("/api/user");
      setUser(result.data.user ?? result.data);
    } catch (error) {
      console.error("Failed to fetch current user profile:", error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      FetchUser();
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [status, FetchUser]);

  const data = {
    user,
    setUser,
    refetchUser: FetchUser,
    RefetchUser: FetchUser,
  };

  return (
    <userDataContext.Provider value={data}>{children}</userDataContext.Provider>
  );
};

export default UserContext;

