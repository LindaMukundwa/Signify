import React, { useEffect, useState } from "react";
import type { MedicalProfile } from "../../types/profile";
import { generateQRForProfile, buildResponderURL } from "../../lib/generateQR";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";

interface QRDisplayProps {
  profile: MedicalProfile;
}

export const QRDisplay: React.FC<QRDisplayProps> = ({ profile }) => {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const generateQR = async () => {
      try {
        setLoading(true);
        setError("");
        const url = await generateQRForProfile(profile);
        setQrUrl(url);
      } catch (err) {
        setError("Failed to generate QR code");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [profile]);

  const responderUrl = buildResponderURL(profile);
  const urlLength = responderUrl.length;
  const urlWarning = urlLength > 2000;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(responderUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Share Your Medical ID</h2>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        {loading ? (
          <div className="w-40 h-40 flex items-center justify-center bg-surface-secondary rounded">
            <p className="text-text-muted">Generating QR code...</p>
          </div>
        ) : error ? (
          <div className="w-40 h-40 flex items-center justify-center bg-red-50 rounded border border-danger">
            <p className="text-danger text-sm text-center">{error}</p>
          </div>
        ) : (
          <img
            src={qrUrl}
            alt="Medical ID QR Code"
            className="w-40 h-40 rounded border border-border"
          />
        )}
      </div>

      {/* Share Methods */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="primary"
          fullWidth
          onClick={copyToClipboard}
          disabled={!qrUrl}
        >
          Copy Link
        </Button>

        <a
          href={`https://www.qrserver.com/qr-code/?size=300x300&data=${encodeURIComponent(responderUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary block w-full text-center"
        >
          Save QR Code
        </a>
      </div>

      {/* URL Length Warning */}
      {urlWarning && (
        <div className="mt-4 p-3 bg-yellow-50 border border-warning rounded">
          <p className="text-sm text-warning font-semibold">
            ⚠️ Your profile is quite large ({urlLength} characters). This may result in
            a dense QR code. Consider removing some information.
          </p>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-primary-light rounded">
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">How it works:</span> First
          responders can scan this QR code to view your medical information on any
          device. No backend storage required.
        </p>
      </div>
    </Card>
  );
};