import React from "react";
import type { MedicalProfile } from "../../types/profile";
import { Card } from "../shared/Card";

interface MedicalIDCardProps {
  profile: MedicalProfile;
}

export const MedicalIDCard: React.FC<MedicalIDCardProps> = ({ profile }) => {
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card large className="max-w-sm mx-auto">
      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
          {initials}
        </div>
      </div>

      {/* Name */}
      <div className="text-center mb-2">
        <h1>{profile.name}</h1>
      </div>

      {/* Last Updated */}
      {profile.lastUpdated && (
        <p className="text-xs text-text-muted text-center mb-6">
          Last updated: {formatDate(profile.lastUpdated)}
        </p>
      )}

      <hr className="border-border my-6" />

      {/* Basic Info Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Blood Type */}
        <div>
          <p className="text-sm text-text-secondary font-semibold">Blood Type</p>
          <p className="text-base text-text-primary mt-1">
            {profile.bloodType || "—"}
          </p>
        </div>

        {/* Age */}
        <div>
          <p className="text-sm text-text-secondary font-semibold">Age</p>
          <p className="text-base text-text-primary mt-1">{profile.age || "—"}</p>
        </div>
      </div>

      <hr className="border-border my-6" />

      {/* Allergies */}
      {profile.allergies.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-text-secondary font-semibold mb-2">
            Allergies
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.allergies.map((allergy, idx) => (
              <span key={idx} className="badge badge-danger">
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* DNR */}
      {profile.dnr && (
        <div className="mb-6 p-3 bg-red-50 border border-danger rounded-md">
          <p className="text-sm font-semibold text-danger">Do Not Resuscitate</p>
        </div>
      )}

      {/* Medications */}
      {profile.medications.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-text-secondary font-semibold mb-2">
            Medications
          </p>
          <ul className="space-y-1">
            {profile.medications.map((med, idx) => (
              <li key={idx} className="text-sm text-text-primary">
                • {med}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Conditions */}
      {profile.conditions.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-text-secondary font-semibold mb-2">
            Conditions
          </p>
          <ul className="space-y-1">
            {profile.conditions.map((cond, idx) => (
              <li key={idx} className="text-sm text-text-primary">
                • {cond}
              </li>
            ))}
          </ul>
        </div>
      )}

      <hr className="border-border my-6" />

      {/* Emergency Contact */}
      {profile.emergencyContactName && (
        <div className="mb-6">
          <p className="text-sm text-text-secondary font-semibold mb-2">
            Emergency Contact
          </p>
          <p className="text-sm text-text-primary font-semibold">
            {profile.emergencyContactName}
          </p>
          {profile.emergencyContactPhone && (
            <p className="text-sm text-text-secondary">{profile.emergencyContactPhone}</p>
          )}
          {profile.emergencyContactRelation && (
            <p className="text-sm text-text-secondary">
              {profile.emergencyContactRelation}
            </p>
          )}
        </div>
      )}

      {/* Insurance */}
      {(profile.insuranceProvider || profile.insuranceMemberId) && (
        <div className="mb-6">
          <p className="text-sm text-text-secondary font-semibold mb-2">
            Insurance
          </p>
          {profile.insuranceProvider && (
            <p className="text-sm text-text-primary">{profile.insuranceProvider}</p>
          )}
          {profile.insuranceMemberId && (
            <p className="text-sm text-text-secondary">ID: {profile.insuranceMemberId}</p>
          )}
        </div>
      )}

      {/* Communication Note */}
      {profile.communicationNote && (
        <div>
          <p className="text-sm text-text-secondary font-semibold mb-2">
            Communication Note
          </p>
          <p className="text-sm text-text-primary italic">
            {profile.communicationNote}
          </p>
        </div>
      )}
    </Card>
  );
};
