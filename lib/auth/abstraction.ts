export interface UserSession {
  id: string;
  email: string;
  name?: string;
  role: "client" | "admin" | "ADMIN" | "TEAM";
}

export interface AuthResponse {
  success: boolean;
  session?: UserSession;
  error?: string;
  message?: string;
}

/**
 * Authentication Service Abstraction Layer.
 * Interacts with secure server-side authentication endpoints.
 */
export class AuthService {
  /**
   * Retrieves the current user session from the server.
   */
  static async getCurrentSession(): Promise<UserSession | null> {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok) return null;
      const data = await response.json();
      if (data.authenticated && data.session) {
        return data.session as UserSession;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Authenticates a user with email and password.
   */
  static async login(email: string, password?: string): Promise<AuthResponse> {
    if (!email || !email.includes("@")) {
      return {
        success: false,
        error: "Please enter a valid email address.",
      };
    }

    if (!password) {
      return {
        success: false,
        error: "Please enter your password.",
      };
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || "Authentication failed. Please check your credentials.",
        };
      }

      return {
        success: true,
        session: data.user,
        message: data.message,
      };
    } catch {
      return {
        success: false,
        error: "Network error occurred while authenticating. Please try again.",
      };
    }
  }

  /**
   * Registers a new user account.
   */
  static async signup(email: string, name?: string, password?: string): Promise<AuthResponse> {
    if (!name || name.trim().length < 2) {
      return {
        success: false,
        error: "Please enter your full name (at least 2 characters).",
      };
    }

    if (!email || !email.includes("@")) {
      return {
        success: false,
        error: "Please enter a valid email address.",
      };
    }

    if (!password || password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long.",
      };
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || "Failed to create account. Please try again.",
        };
      }

      return {
        success: true,
        session: data.user,
        message: data.message,
      };
    } catch {
      return {
        success: false,
        error: "Network error occurred while submitting access request.",
      };
    }
  }

  /**
   * Logs out the user and clears authentication cookies.
   */
  static async logout(): Promise<void> {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("[AuthService Logout Error]:", err);
    }
  }
}
