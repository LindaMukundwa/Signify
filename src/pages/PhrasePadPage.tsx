import { PhrasePad } from "../components/phrase-pad/PhrasePad";

export default function PhrasePadPage() {
  return (
    <div className="bg-bg">
      <main className="max-w-app w-full mx-auto px-4 py-8 pb-6">
        <div className="mb-8">
          <p className="text-text-secondary">
            Tap any phrase to speak it aloud. Add custom phrases that matter to you.
          </p>
        </div>

        <PhrasePad />
      </main>
    </div>
  );
}