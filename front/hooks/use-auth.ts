"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

type LoginCredentials = {
  email: string;
  password: string;
};

type SignupCredentials = LoginCredentials;

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Fetch current user on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();

        if (data.user) {
          setState({
            user: data.user,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
          setState((prev) => ({ ...prev, isLoading: false }));
          return { error: data.error || "Erreur de connexion" };
        }

        setState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });

        router.push("/app");
        return { success: true };
      } catch {
        setState((prev) => ({ ...prev, isLoading: false }));
        return { error: "Erreur de connexion au serveur" };
      }
    },
    [router]
  );

  // Signup
  const signup = useCallback(
    async (credentials: SignupCredentials) => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
          setState((prev) => ({ ...prev, isLoading: false }));
          return { error: data.error || "Erreur d'inscription" };
        }

        setState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });

        router.push("/app");
        return { success: true };
      } catch {
        setState((prev) => ({ ...prev, isLoading: false }));
        return { error: "Erreur de connexion au serveur" };
      }
    },
    [router]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      router.push("/auth");
    }
  }, [router]);

  return {
    ...state,
    login,
    signup,
    logout,
  };
}

