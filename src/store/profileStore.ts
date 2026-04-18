/**
 * Local profile storage for user
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type MedicalProfile, EMPTY_PROFILE } from "../types/profile";


interface ProfileStore {
  profile: MedicalProfile;
  setProfile: (profile: MedicalProfile) => void;
  updateProfile: (partial: Partial<MedicalProfile>) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: EMPTY_PROFILE,
      setProfile: (profile: MedicalProfile) => set({ profile }),
      updateProfile: (partial: Partial<MedicalProfile>) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...partial,
            lastUpdated: new Date().toISOString(),
          },
        })),
      clearProfile: () => set({ profile: EMPTY_PROFILE }),
    }),
    {
      name: "signify-profile",
      version: 1,
    }
  )
);
