export interface UserSession {
  id: string;
  email: string;
  name?: string;
  role: "client" | "admin";
}

export interface AuthResponse {
  success: boolean;
  session?: UserSession;
  error?: string;
}

/**
 * Authentication Service Abstraction Layer.
 * Decouples business UI components from direct auth provider implementation details.
 */
export class AuthService {
  static async getCurrentSession(): Promise<UserSession | null> {
    // Placeholder architecture for session retrieval
    return null;
  }

  static async login(email: string, password?: string): Promise<AuthResponse> {
    if (!email || !email.includes("@")) {
      return {
        success: false,
        error: "Please enter a valid email address.",
      };
    }

    // Architecture ready for provider integration (NextAuth, Supabase, Auth0)
    console.log("[AuthService] Login attempt:", email, password ? "(Password provided)" : "");
    return {
      success: true,
      session: {
        id: "usr_mock_123",
        email,
        role: "client",
      },
    };
  }

  static async signup(email: string, name?: string): Promise<AuthResponse> {
    if (!email || !email.includes("@")) {
      return {
        success: false,
        error: "Please enter a valid email address.",
      };
    }

    console.log("[AuthService] Signup attempt:", email, name);
    return {
      success: true,
      session: {
        id: "usr_mock_123",
        email,
        name,
        role: "client",
      },
    };
  }

  static async logout(): Promise<void> {
    console.log("[AuthService] Logged out.");
  }
}
