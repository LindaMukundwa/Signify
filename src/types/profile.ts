// Storing primary data type used throughout application for a patient medical profile
export interface MedicalProfile {
  name: string;
  age: string;
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  insuranceProvider: string;
  insuranceMemberId: string;
  communicationNote: string;
  dnr: boolean;
  lastUpdated: string;
}

export const EMPTY_PROFILE: MedicalProfile = {
  name: "",
  age: "",
  bloodType: "",
  allergies: [],
  medications: [],
  conditions: [],
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",
  insuranceProvider: "",
  insuranceMemberId: "",
  communicationNote: "",
  dnr: false,
  lastUpdated: new Date().toISOString(),
};