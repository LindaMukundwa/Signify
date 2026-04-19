import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { MedicalProfile } from "../types/profile";
import { decodeProfile } from "../lib/encodeProfile";
import { MedicalIDCard } from "../components/medical-id/MedicalIDCard";
import { Card } from "../components/shared/Card";
import { AlertCircle } from "lucide-react";

export default function ResponderPage() {
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<MedicalProfile | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = searchParams.get("data");

    if (!data) {
      setError("No medical information provided");
      setLoading(false);
      return;
    }

    try {
      const decoded = decodeProfile(data);
      setProfile(decoded);
    } catch (err) {
      setError("Failed to decode medical information");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Card>
          <p className="text-text-muted text-center">Loading medical information...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <Card className="w-full">
          <div className="flex gap-4">
            <AlertCircle className="text-danger flex-shrink-0" size={24} />
            <div>
              <h2 className="font-semibold text-danger">Error</h2>
              <p className="text-text-secondary text-sm mt-1">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <Card className="w-full">
          <div className="flex gap-4">
            <AlertCircle className="text-warning flex-shrink-0" size={24} />
            <div>
              <h2 className="font-semibold text-warning">No Profile</h2>
              <p className="text-text-secondary text-sm mt-1">
                No medical information found in this QR code
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-app mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-text-primary">Medical Information</h1>
          <p className="text-sm text-text-secondary mt-1">
            Scanned from QR code • Read-only
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-app w-full mx-auto px-4 py-8">
        {/* Important Note */}
        <Card className="bg-danger/5 border-danger mb-8">
          <div className="flex gap-3">
            <AlertCircle className="text-danger flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-danger text-sm">Important</p>
              <p className="text-sm text-text-secondary mt-1">
                Always confirm information with the patient. This QR code is not encrypted.
              </p>
            </div>
          </div>
        </Card>

        {/* Medical ID Card */}
        <MedicalIDCard profile={profile} />

        {/* Critical Fields Summary */}
        <div className="mt-8 space-y-4">
          {profile.dnr && (
            <Card className="bg-danger/10 border-danger">
              <div className="flex gap-3">
                <span className="text-2xl">🚫</span>
                <div>
                  <p className="font-semibold text-danger">Do Not Resuscitate (DNR)</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Patient has a Do Not Resuscitate order
                  </p>
                </div>
              </div>
            </Card>
          )}

          {profile.allergies.length > 0 && (
            <Card className="bg-danger/10 border-danger">
              <div className="flex gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-semibold text-danger">Allergies</p>
                  <ul className="mt-2 space-y-1">
                    {profile.allergies.map((allergy, idx) => (
                      <li key={idx} className="text-sm text-text-secondary">
                        • {allergy}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {profile.communicationNote && (
            <Card className="bg-primary-light border-primary">
              <div className="flex gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-semibold text-primary">Communication</p>
                  <p className="text-sm text-text-secondary mt-1">
                    {profile.communicationNote}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 p-4 bg-surface-secondary rounded text-center text-sm text-text-muted">
          <p>Signify • Privacy-first medical information sharing</p>
          <p className="mt-2">Data transmitted via QR code is not encrypted. For emergency use only.</p>
        </div>
      </main>
    </div>
  );
}
