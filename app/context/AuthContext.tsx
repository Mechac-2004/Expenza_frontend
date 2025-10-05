"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (last_name: string, first_name: string, phone: string, email: string, password: string, password2: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user_data");
    
    if (token) {
      try {
        const res = await api.get<User>("auth/user/");
        setUser(res.data);
        localStorage.setItem("user_data", JSON.stringify(res.data));
      } catch (error: any) {
        console.warn("Erreur lors de la vérification auth:", error.response?.status);
        
        // Si l'endpoint n'existe pas (404) mais qu'on a des données en cache, les utiliser
        if (error.response?.status === 404 && storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user_data");
          }
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_data");
        }
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("auth/login/", { email, password });
      
      console.log("Réponse du login:", res.data);
      
      // Vérifier différents formats de réponse possibles
      const accessToken = res.data.tokens?.access || res.data.access || res.data.access_token || res.data.token;
      const refreshToken = res.data.tokens?.refresh || res.data.refresh || res.data.refresh_token;
      const userData = res.data.user;
      
      if (!accessToken) {
        console.error("Structure de la réponse:", res.data);
        throw new Error("Token d'accès manquant dans la réponse");
      }
      
      localStorage.setItem("access_token", accessToken);
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }
      
      // Si les données utilisateur sont dans la réponse du login, les utiliser directement
      if (userData) {
        setUser(userData);
        localStorage.setItem("user_data", JSON.stringify(userData));
        toast.success("Connexion réussie !");
        router.push("/");
        return; // Pas besoin d'appeler l'endpoint /auth/user/
      }
      
      // Récupérer les infos de l'utilisateur
      try {
        const userRes = await api.get<User>("auth/user/");
        setUser(userRes.data);
        localStorage.setItem("user_data", JSON.stringify(userRes.data));
      } catch (userError: any) {
        console.warn("Impossible de récupérer les infos utilisateur (endpoint 404)");
        
        // Si l'endpoint n'existe pas (404), créer un utilisateur minimal
        if (userError.response?.status === 404) {
          // Vérifier si les données utilisateur sont dans la réponse du login
          const userData = res.data.user || res.data.data?.user;
          
          if (userData) {
            setUser(userData);
            localStorage.setItem("user_data", JSON.stringify(userData));
          } else {
            // Créer un utilisateur minimal avec l'email
            const minimalUser: User = {
              id: res.data.user_id || "temp",
              username: email.split("@")[0],
              email: email,
            };
            setUser(minimalUser);
            localStorage.setItem("user_data", JSON.stringify(minimalUser));
          }
        } else {
          throw userError;
        }
      }
      
      toast.success("Connexion réussie !");
      router.push("/");
    } catch (error: any) {
      console.error("Erreur de connexion", error);
      
      // Nettoyer les tokens en cas d'erreur
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      
      if (error.response?.data) {
        const errorMsg = error.response.data.detail || error.response.data.message || "Identifiants incorrects";
        toast.error(errorMsg);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Erreur de connexion");
      }
      throw error;
    }
  };

  const register = async (last_name: string, first_name: string, phone: string, email: string, password: string, password2: string) => {
    try {
      await api.post("auth/register/", { last_name, first_name, phone, email, password, password2 });
      toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      router.push("/login");
    } catch (error: any) {
      console.error("Erreur d'inscription", error);
      if (error.response?.data) {
        const errors = error.response.data;
        if (errors.first_name) {
          toast.error(`Prénom: ${errors.first_name[0]}`);
        } else if (errors.last_name) {
          toast.error(`Nom: ${errors.last_name[0]}`);
        } else if (errors.phone) {
          toast.error(`Téléphone: ${errors.phone[0]}`);
        } else if (errors.email) {
          toast.error(`Email: ${errors.email[0]}`);
        } else if (errors.password) {
          toast.error(`Mot de passe: ${errors.password[0]}`);
        } else if (errors.password2) {
          toast.error(`Confirmation: ${errors.password2[0]}`);
        } else {
          toast.error("Erreur lors de l'inscription");
        }
      } else {
        toast.error("Erreur lors de l'inscription");
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    toast.success("Déconnexion réussie");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
