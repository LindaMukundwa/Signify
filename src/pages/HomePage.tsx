import React from "react";
import { Link } from "react-router-dom";
import { Heart, Zap, Hand, QrCode } from "lucide-react";
import { Button } from "../components/shared/Button";
import { Card } from "../components/shared/Card";
import SignifyLogo from "../assets/SignifyLogo.png";
import { useProfileStore } from "../store/profileStore";

export default function HomePage() {
  const profile = useProfileStore((state) => state.profile);
  const hasProfile = !!profile.name;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-app mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <img
              src={SignifyLogo}
              alt="Signify logo"
              className="w-12 h-12"
              style={{ width: '100px', borderRadius: '50%' }} 
            />
            <div>
              <p className="text-sm text-text-secondary mt-0">
                Built for breaking down communication barriers
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-app w-full mx-auto px-4 py-8 space-y-8">
        {/* Welcome Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-text-primary">Welcome</h2>
          <p className="text-text-secondary">
            Signify helps you communicate with hearing people in emergency and
            everyday situations. All data stays on your device.
          </p>
        </div>

        {/* Quick Stats / Status */}
        {hasProfile && (
          <Card className="bg-primary-light border-primary">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-text-primary">{profile.name}</p>
                <p className="text-sm text-text-secondary">Profile saved</p>
              </div>
            </div>
          </Card>
        )}

        {/* Feature Cards */}
        <div className="grid gap-4">
          {/* Medical ID */}
          <Link to="/medical-id" className="no-underline">
            <Card className="cursor-pointer hover:bg-surface-secondary transition-colors h-full">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-danger/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="text-danger" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">Medical ID</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Create and share your medical information via QR code
                  </p>
                  {hasProfile && (
                    <p className="text-xs text-success font-medium mt-2">✓ Profile ready</p>
                  )}
                </div>
              </div>
            </Card>
          </Link>

          {/* Phrase Pad */}
          <Link to="/phrases" className="no-underline">
            <Card className="cursor-pointer hover:bg-surface-secondary transition-colors h-full">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                  <Zap className="text-primary" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">Phrase Pad</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Quick-tap phrases with text-to-speech
                  </p>
                  <p className="text-xs text-text-muted font-medium mt-2">
                    12+ built-in phrases
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Fingerspelling */}
          <Link to="/fingerspell" className="no-underline">
            <Card className="cursor-pointer hover:bg-surface-secondary transition-colors h-full">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <Hand className="text-warning" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">Fingerspelling</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Real-time ASL letter recognition
                  </p>
                  <p className="text-xs text-text-muted font-medium mt-2">
                    Requires camera access
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* CTA Section */}
        {!hasProfile && (
          <Card className="bg-primary-light border-primary">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <QrCode className="text-primary flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-text-primary">
                    Get Started with Medical ID
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Create a shareable QR code with your medical information
                  </p>
                </div>
              </div>
              <Link to="/medical-id">
                <Button variant="primary" fullWidth>
                  Create Medical ID
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* ADA Resources Section */}
        <Card className="border-primary bg-primary-light">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚖️</span>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">Know Your ADA Rights</h3>
                <p className="text-sm text-text-secondary mt-2">
                  Under the Americans with Disabilities Act (ADA), you have the right to
                  <strong> effective communication</strong> in healthcare settings. This means
                  you must receive information as clearly as those without disabilities.
                </p>
              </div>
            </div>

            <hr className="border-primary/20" />

            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-text-primary mb-1">Your rights include:</p>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Written communication, note-taking, or detailed explanations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Visual aids, diagrams, or demonstrations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Time to review information before decisions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>
                      Accommodation for your preferred communication method (writing,
                      gestures, etc.)
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-text-primary mb-1">
                  When contacting a healthcare provider:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>State your communication needs clearly upfront</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>Use Signify to share your Medical ID and communication preferences</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>Request confirmation that information is understood</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>
                      If accommodations are denied, report to the HHS Office for Civil Rights
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <hr className="border-primary/20" />

            <div className="p-3 bg-white/50 rounded text-sm">
              <p className="font-semibold text-text-primary mb-1">Need Help?</p>
              <p className="text-text-secondary mb-2">
                If you need more information about your ADA rights or want to file a complaint:
              </p>
              <a
                href="https://www.hhs.gov/ocr/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:text-primary-dark transition-colors"
              >
                HHS Office for Civil Rights →
              </a>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div>
          <h3 className="font-semibold text-text-primary mb-4">Why Signify?</h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span className="text-text-secondary text-sm">
                <strong className="text-text-primary">No backend.</strong> Your data never
                leaves your device
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span className="text-text-secondary text-sm">
                <strong className="text-text-primary">Works offline.</strong> No internet
                required to use
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span className="text-text-secondary text-sm">
                <strong className="text-text-primary">Accessibility-first.</strong> Designed
                for Deaf and hard-of-hearing users
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span className="text-text-secondary text-sm">
                <strong className="text-text-primary">Mobile & desktop.</strong> Works
                seamlessly on any device
              </span>
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-12">
        <div className="max-w-app mx-auto px-4 py-6 text-center text-sm text-text-muted">
          <p>Signify • Open source • Privacy-first communication</p>
        </div>
      </footer>
    </div>
  );
}