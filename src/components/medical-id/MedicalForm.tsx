import React, { useState } from "react";
import type { MedicalProfile } from "../../types/profile";
import { Button } from "../shared/Button";
import { useProfileStore } from "../../store/profileStore";

interface MedicalIDFormProps {
  onSubmit?: () => void;
}

export const MedicalIDForm: React.FC<MedicalIDFormProps> = ({ onSubmit }) => {
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const [formData, setFormData] = useState<MedicalProfile>(profile);
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [newCondition, setNewCondition] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy],
      }));
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setFormData((prev) => ({
        ...prev,
        medications: [...prev.medications, newMedication],
      }));
      setNewMedication("");
    }
  };

  const removeMedication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData((prev) => ({
        ...prev,
        conditions: [...prev.conditions, newCondition],
      }));
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              className="input"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                id="age"
                type="text"
                name="age"
                className="input"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="e.g., 32"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bloodType">Blood Type</label>
              <select
                id="bloodType"
                name="bloodType"
                className="input"
                value={formData.bloodType}
                onChange={handleInputChange}
              >
                <option value="">Select blood type</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Medical Information</h2>
        <div className="space-y-4">
          {/* Allergies */}
          <div className="form-group">
            <label>Allergies</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="input flex-1"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add an allergy"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
              />
              <button
                type="button"
                onClick={addAllergy}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.allergies.map((allergy, idx) => (
                <div
                  key={idx}
                  className="badge badge-danger flex items-center gap-2"
                >
                  {allergy}
                  <button
                    type="button"
                    onClick={() => removeAllergy(idx)}
                    className="text-current hover:opacity-70"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Medications */}
          <div className="form-group">
            <label>Medications</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="input flex-1"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                placeholder="Add a medication"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMedication())}
              />
              <button
                type="button"
                onClick={addMedication}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.medications.map((med, idx) => (
                <div
                  key={idx}
                  className="badge badge-primary flex items-center gap-2"
                >
                  {med}
                  <button
                    type="button"
                    onClick={() => removeMedication(idx)}
                    className="text-current hover:opacity-70"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions */}
          <div className="form-group">
            <label>Conditions</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="input flex-1"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add a condition"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
              />
              <button
                type="button"
                onClick={addCondition}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.conditions.map((cond, idx) => (
                <div
                  key={idx}
                  className="badge badge-primary flex items-center gap-2"
                >
                  {cond}
                  <button
                    type="button"
                    onClick={() => removeCondition(idx)}
                    className="text-current hover:opacity-70"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Communication Note */}
          <div className="form-group">
            <label htmlFor="communicationNote">Communication Note</label>
            <textarea
              id="communicationNote"
              name="communicationNote"
              className="input"
              placeholder="e.g., Deaf/uses ASL, prefers written communication"
              value={formData.communicationNote}
              onChange={handleInputChange}
            />
          </div>

          {/* DNR */}
          <div className="flex items-center gap-3">
            <input
              id="dnr"
              type="checkbox"
              name="dnr"
              className="w-5 h-5 cursor-pointer"
              checked={formData.dnr}
              onChange={handleInputChange}
            />
            <label htmlFor="dnr" className="cursor-pointer font-medium">
              Do Not Resuscitate (DNR)
            </label>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Emergency Contact</h2>
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="emergencyContactName">Name</label>
            <input
              id="emergencyContactName"
              type="text"
              name="emergencyContactName"
              className="input"
              value={formData.emergencyContactName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="emergencyContactPhone">Phone</label>
            <input
              id="emergencyContactPhone"
              type="tel"
              name="emergencyContactPhone"
              className="input"
              value={formData.emergencyContactPhone}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="emergencyContactRelation">Relation</label>
            <input
              id="emergencyContactRelation"
              type="text"
              name="emergencyContactRelation"
              className="input"
              placeholder="e.g., Mother, Spouse"
              value={formData.emergencyContactRelation}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Insurance */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Insurance</h2>
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="insuranceProvider">Provider</label>
            <input
              id="insuranceProvider"
              type="text"
              name="insuranceProvider"
              className="input"
              value={formData.insuranceProvider}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="insuranceMemberId">Member ID</label>
            <input
              id="insuranceMemberId"
              type="text"
              name="insuranceMemberId"
              className="input"
              value={formData.insuranceMemberId}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button type="submit" variant="primary" fullWidth>
          Save Profile
        </Button>
      </div>
    </form>
  );
};
