import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { MedicalIDForm } from "../components/medical-id/MedicalForm";
import { MedicalIDCard } from "../components/medical-id/MedicalIDCard";
import { QRDisplay } from "../components/medical-id/QRDisplay";
import { useProfileStore } from "../store/profileStore";

type TabType = "form" | "preview";

export default function MedicalIDPage() {
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const [activeTab, setActiveTab] = useState<TabType>(profile.name ? "preview" : "form");

  const hasProfile = !!profile.name;

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-app mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-secondary transition-colors"
            aria-label="Back to home"
          >
            <ChevronLeft size={24} className="text-text-primary" />
          </Link>
          <h1 className="text-xl font-semibold text-text-primary">Your Medical ID</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-app w-full mx-auto px-4 py-8 pb-20">
        {hasProfile && (
          <div className="mb-6 flex gap-2 bg-surface rounded-lg p-1">
            <button
              onClick={() => setActiveTab("form")}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "form"
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "preview"
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              View & Share
            </button>
          </div>
        )}

        {activeTab === "form" ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                {hasProfile ? "Update Profile" : "Create Your Medical ID"}
              </h2>
              <p className="text-text-secondary">
                {hasProfile
                  ? "Update your medical information. All data is stored locally on your device."
                  : "Enter your medical information to create a shareable QR code. This stays on your device."}
              </p>
            </div>

            <MedicalIDForm
              onSubmit={() => {
                if (hasProfile) {
                  setActiveTab("preview");
                }
              }}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Your Medical ID</h2>
              <p className="text-text-secondary">
                Your medical information is displayed below. Share your QR code with first
                responders or healthcare providers.
              </p>
            </div>

            {/* Card Preview */}
            <div>
              <h3 className="font-semibold text-text-primary mb-4">Card Preview</h3>
              <MedicalIDCard profile={profile} />
            </div>

            {/* QR Code */}
            <div>
              <h3 className="font-semibold text-text-primary mb-4">Share via QR Code</h3>
              <QRDisplay profile={profile} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}