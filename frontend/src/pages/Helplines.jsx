import { PhoneCall, Info } from "lucide-react";
import PageHeader from "../components/PageHeader";
import HelplineCard from "../components/HelplineCard";
import { helplines, moreHelplines } from "../data/helplines";

export default function Helplines() {
  return (
    <div>
      <PageHeader icon={PhoneCall} title="Emergency helplines" iconClass="from-safe to-teal-400">
        Tap a number to open your phone dialer. These calls are free in India.
      </PageHeader>

      <section aria-labelledby="main-numbers" className="mt-10">
        <h2 id="main-numbers" className="font-display text-xl font-bold text-ink">
          Main emergency numbers
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {helplines.map((h) => (
            <HelplineCard key={h.number} h={h} />
          ))}
        </div>
      </section>

      <section aria-labelledby="other-numbers" className="mt-12">
        <h2 id="other-numbers" className="font-display text-xl font-bold text-ink">
          Other useful numbers
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {moreHelplines.map((h) => (
            <HelplineCard key={h.number} h={h} />
          ))}
        </div>
      </section>

      <p className="mt-8 flex items-start gap-2 rounded-2xl bg-lavender/60 p-4 text-sm text-ink">
        <Info size={18} className="mt-0.5 shrink-0 text-berry" aria-hidden="true" />
        Numbers can change. Check them against official government sources before you rely on them.
      </p>
    </div>
  );
}
