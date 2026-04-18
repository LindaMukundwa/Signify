import type { MedicalProfile } from "../types/profile";

export const encodeProfile = (profile: MedicalProfile): string => {
  const json = JSON.stringify(profile);
  return btoa(unescape(encodeURIComponent(json)));
};

export const decodeProfile = (encoded: string): MedicalProfile => {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch (error) {
    throw new Error("Failed to decode profile");
  }
};
