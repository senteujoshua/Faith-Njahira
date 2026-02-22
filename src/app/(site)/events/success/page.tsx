import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function EventSuccessPage() {
  return (
    <main className="min-h-screen bg-cream-lightest pt-28 pb-20">
      <Suspense fallback={<div className="text-center font-body text-warm-gray">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
