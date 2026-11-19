import { Link } from "react-router-dom";
import { CheckCircle2, ShieldCheck, Phone } from "lucide-react";
import PageHeader from "../components/PageHeader";
import AiRecommendations from "../components/AiRecommendations";
import { safetyCategories } from "../data/safetyTips";
import { focusRing } from "../utils/ui";

export default function SafetyTips() {
  return (
    <div>
      <PageHeader icon={ShieldCheck} title="Safety tips" iconClass="from-rose to-pink-300">
        Small habits that make a big difference. If you are ever in danger, call 112.
      </PageHeader>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {safetyCategories.map(({ id, title, icon: Icon, iconBg, intro, tips }) => (
          <section
            key={id}
            aria-labelledby={`tips-${id}`}
            className="rounded-3xl border border-line bg-white p-6 shadow-sm shadow-berry/5 transition duration-300 motion-safe:hover:-translate-y-1 hover:border-berry/40 hover:shadow-xl hover:shadow-berry/15 sm:p-7"
          >
            <div className="flex items-center gap-4">
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg shadow-berry/20 ${iconBg}`}
              >
                <Icon size={26} aria-hidden="true" />
              </span>
              <div>
                <h2 id={`tips-${id}`} className="font-display text-xl font-bold text-ink">
                  {title}
                </h2>
                <p className="text-sm text-muted">{intro}</p>
              </div>
            </div>
            <ul className="mt-5 space-y-3">
              {tips.map((tip) => (
                <li key={tip} className="flex gap-3 text-ink">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-safe" aria-hidden="true" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <AiRecommendations />

      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-linear-to-r from-berry to-rose p-6 text-white shadow-xl shadow-berry/20 sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="font-display text-xl font-bold">In immediate danger?</p>
          <p className="text-white/90">Do not wait. Call the national emergency number now.</p>
        </div>
        <a
          href="tel:112"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-alert transition hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-berry"
        >
          <Phone size={18} aria-hidden="true" /> Call 112
        </a>
      </div>

      <Link to="/sos" className={`mt-6 inline-block rounded text-sm font-bold text-berry hover:underline ${focusRing}`}>
        Open the Emergency SOS page
      </Link>
    </div>
  );
}
