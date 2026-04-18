/**
 * This is the file that will allow responders to get access to their 
 * patient's medical information in the form of a QR code
 */
import type { MedicalProfile } from "../types/profile";
import { encodeProfile } from "./encodeProfile";

const BASE_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173";

export const buildResponderURL = (profile: MedicalProfile): string => {
  const encoded = encodeProfile(profile);
  return `${BASE_URL}/responder?data=${encoded}`;
};

export const generateQRCodeDataURL = async (text: string): Promise<string> => {
  // Use qr-server.com for QR generation - simple HTTP API
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedText}`;
};

export const generateQRForProfile = async (profile: MedicalProfile): Promise<string> => {
  const url = buildResponderURL(profile);
  return generateQRCodeDataURL(url);
};