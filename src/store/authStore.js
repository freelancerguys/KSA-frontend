import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      profile: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (data) =>
        set({
          user: data.user,
          profile: data.profile,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: true,
        }),
      setSession: (data) =>
        set({
          user: data.user,
          profile: data.profile || null,
          isAuthenticated: true,
        }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      logout: () =>
        set({
          user: null,
          profile: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
      updateProfile: (profile) => set({ profile }),
    }),
    {
      name: 'ksa-auth',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
