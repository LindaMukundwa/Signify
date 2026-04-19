import { useState } from "react";
import { MedicalIDForm } from "../components/medical-id/MedicalForm";
import { MedicalIDCard } from "../components/medical-id/MedicalIDCard";
import { QRDisplay } from "../components/medical-id/QRDisplay";
import { useProfileStore } from "../store/profileStore";

type TabType = "form" | "preview";

export default function MedicalIDPage() {
  const profile = useProfileStore((state) => state.profile);
  const [activeTab, setActiveTab] = useState<TabType>(profile.name ? "preview" : "form");

  const hasProfile = !!profile.name;

  return (
    <div className="bg-bg">
      <main className="max-w-app w-full mx-auto px-4 py-8 pb-6">
        {hasProfile && (
          <div className="mb-6 flex bg-surface-secondary rounded-full p-1 gap-1 border border-border">
            <button
              onClick={() => setActiveTab("form")}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === "form"
                  ? "bg-surface text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === "preview"
                  ? "bg-surface text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
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