// 👉 TẠI SAO: Zustand cho state management - đơn giản hơn Redux, built-in TypeScript support
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { cacheService } from '@/services/cacheService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: (userData: User) => {
        set({ 
          user: userData, 
          isAuthenticated: true,
          isLoading: false 
        });
      },
      
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        });
        // 👉 TẠI SAO: Clear cache khi logout để bảo mật
        cacheService.clearAll();
      },
      
      updateProfile: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { ...user, ...userData } 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
