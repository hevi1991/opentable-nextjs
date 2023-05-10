"use client";

import axios, { AxiosError } from "axios";
import { getCookie } from "cookies-next";
import React, { createContext, useEffect, useState } from "react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
}

interface State {
  loading: boolean;
  signLoading: boolean;
  data: User | null;
  error: string | null;
}

interface AuthState extends State {
  setAuthState: React.Dispatch<React.SetStateAction<State>>;
}

export const AuthenicationContext = createContext<AuthState>({
  loading: false,
  signLoading: false,
  data: null,
  error: null,
  setAuthState: () => {},
});

export default function AuthContext({
  children,
}: {
  children: React.ReactNode;
}) {
  // default values
  const [authState, setAuthState] = useState<State>({
    loading: true,
    signLoading: false,
    data: null,
    error: null,
  });

  const fetchMe = async () => {
    try {
      setAuthState({
        loading: true,
        signLoading: false,
        data: null,
        error: null,
      });
      const token = getCookie("jwt");
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      const response = await axios.get("/api/auth/me");
      setAuthState({
        loading: false,
        signLoading: false,
        data: response.data,
        error: null,
      });
    } catch (error) {
      let errorMessage: string = "";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data.errorMessage;
      } else {
        errorMessage = (error as Error).message;
      }
      setAuthState({
        loading: false,
        signLoading: false,
        data: null,
        error: errorMessage,
      });
      throw error;
    }
  };

  useEffect(() => {
    const jwt = getCookie("jwt");
    if (jwt) {
      fetchMe();
    } else {
      setAuthState({
        loading: false,
        signLoading: false,
        data: null,
        error: null,
      });
    }
  }, []);

  return (
    <AuthenicationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenicationContext.Provider>
  );
}
