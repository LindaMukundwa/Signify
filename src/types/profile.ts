// Storing primary data type used throughout application for a patient medical profile
export interface MedicalProfile {
  name: string;
  age: string;
  bloodType: string;
  allergies: string[];
  medications: string[];           // name and dosage as strings
  conditions: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  insuranceProvider: string;
  insuranceMemberId: string;
  communicationNote: string;       // e.g. "Deaf/ uses ASL"
  dnr: boolean;
  lastUpdated: string;             // ISO date string
}
