"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useStore";
import { authAPI } from "@/lib/api";

export default function AuthInit() {
  const { setUser, setToken, hydrated } = useAuthStore();

  useEffect(() => {
    // Wait for store to hydrate
    if (!hydrated) return;

    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      
      if (token) {
        try {
          // Verify token and get user data
          const response = await authAPI.getMe();
          if (response.data?.data) {
            setUser(response.data.data);
            setToken(token);
          } else {
            // Token invalid, clear everything
            localStorage.removeItem("accessToken");
            setUser(null);
            setToken(null);
          }
        } catch (error) {
          // Token invalid or expired
          localStorage.removeItem("accessToken");
          setUser(null);
          setToken(null);
        }
      }
    };

    initAuth();
  }, [hydrated, setUser, setToken]);

  return null;
}
