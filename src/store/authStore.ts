/**
 * Authentication Store
 * Manages current user state and authentication
 */

import type { User } from "@/types";
import { create } from "zustand";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // For demo purposes, set a default user (using proper UUID from sample data)
  // In production, this would be loaded from secure storage or authentication
  currentUser: {
    id: "550e8400-e29b-41d4-a716-446655440001",
    username: "sarah.johnson",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    bio: "Creative content creator | Travel enthusiast",
    followers: 125000,
    following: 342,
    likes: 0,
    isVerified: true,
    isOnline: true,
    createdAt: new Date().toISOString(),
  },
  isAuthenticated: true,
  isLoading: false,

  setCurrentUser: (user) =>
    set({
      currentUser: user,
      isAuthenticated: !!user,
    }),

  logout: () =>
    set({
      currentUser: null,
      isAuthenticated: false,
    }),
}));
