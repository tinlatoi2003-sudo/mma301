import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const saveSession = async (response) => {
    const nextToken = response.data.token;
    const nextUser = response.data.user;

    await AsyncStorage.multiSet([
      ["token", nextToken],
      ["user", JSON.stringify(nextUser)]
    ]);

    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (email, password) => {
    const response = await api.login({ email, password });
    await saveSession(response);
  };

  const register = async (payload) => {
    const response = await api.register(payload);
    await saveSession(response);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
