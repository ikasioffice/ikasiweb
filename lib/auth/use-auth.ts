"use client";

// STUB — akan di-replace di Task 15 dengan implementation asli
export function useAuth() {
  return {
    user: null as null | { id: string; email: string },
    isVerified: false,
    isAdmin: false,
    loading: false,
    signInWithGoogle: async () => {},
    signOut: async () => {},
  };
}
