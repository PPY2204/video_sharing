/**
 * Authentication Service
 * Video Sharing App - Team 10
 * Handles user authentication & session management
 */

import type {
  AuthResponse,
  LoginFormData,
  RegisterFormData,
  User,
} from "@/types/app.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiService } from "./restApi";

const TOKEN_KEY = "@video_app_token";
const REFRESH_TOKEN_KEY = "@video_app_refresh_token";
const USER_KEY = "@video_app_user";

/**
 * Authentication Service Class
 */
class AuthService {
  private currentUser: User | null = null;

  /**
   * Login user
   */
  async login(credentials: LoginFormData): Promise<User> {
    try {
      const response = await apiService.login(credentials);

      // Save tokens
      await this.saveAuthData(response);

      // Set current user
      this.currentUser = response.user;

      return response.user;
    } catch (error) {
      if (__DEV__) {
        console.error("Login error:", error);
      }
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterFormData): Promise<User> {
    try {
      const response = await apiService.register(userData);

      // Save tokens
      await this.saveAuthData(response);

      // Set current user
      this.currentUser = response.user;

      return response.user;
    } catch (error) {
      if (__DEV__) {
        console.error("Register error:", error);
      }
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiService.logout();
    } catch (error) {
      if (__DEV__) {
        console.error("Logout error:", error);
      }
    } finally {
      // Clear local data
      await this.clearAuthData();
      this.currentUser = null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token !== null;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      if (userJson) {
        this.currentUser = JSON.parse(userJson);
        return this.currentUser;
      }
    } catch (error) {
      if (__DEV__) {
        console.error("Get current user error:", error);
      }
    }

    return null;
  }

  /**
   * Get stored token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      if (__DEV__) {
        console.error("Get token error:", error);
      }
      return null;
    }
  }

  /**
   * Save authentication data
   */
  private async saveAuthData(response: AuthResponse): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, response.token),
        AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user)),
      ]);

      // Set token in API service
      apiService.setToken(response.token);
    } catch (error) {
      if (__DEV__) {
        console.error("Save auth data error:", error);
      }
      throw error;
    }
  }

  /**
   * Clear authentication data
   */
  private async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);

      // Clear token in API service
      apiService.clearToken();
    } catch (error) {
      if (__DEV__) {
        console.error("Clear auth data error:", error);
      }
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      // Call refresh endpoint (to be implemented)
      // const response = await apiService.refreshToken(refreshToken);
      // await this.saveAuthData(response);
      // return response.token;

      return null;
    } catch (error) {
      if (__DEV__) {
        console.error("Refresh token error:", error);
      }
      await this.logout();
      return null;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export class for testing
export default AuthService;
