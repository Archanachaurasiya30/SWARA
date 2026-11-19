import { Link } from "react-router-dom";
import {
  Siren,
  FileText,
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import HeroVisual from "../components/HeroVisual";
import SectionHeading from "../components/SectionHeading";
import TrustedContacts from "../components/TrustedContacts";
import HowItWorks from "../components/HowItWorks";
import HelplineCard from "../components/HelplineCard";
import { helplines } from "../data/helplines";
import { safetyCategories } from "../data/safetyTips";
import { focusRing } from "../utils/ui";

// The four main feature cards. To change a card, edit it here.
// Every class is written in full so Tailwind can find it.
const features = [
  {
    to: "/sos",
    icon: Siren,
    title: "Emergency SOS",
    text: "Access emergency assistance and view your current location.",
    button: "Open SOS",
    iconBg: "from-alert to-rose shadow-alert/30",
    hover: "hover:border-alert/40 hover:shadow-alert/15",
  },
  {
    to: "/report",
    icon: FileText,
    title: "Report a Crime",
    text: "Submit complaints without mandatory registration.",
    button: "Report now",
    iconBg: "from-berry to-violet-500 shadow-berry/30",
    hover: "hover:border-berry/40 hover:shadow-berry/15",
  },
  {
    to: "/tips",
    icon: ShieldCheck,
    title: "Safety Tips",
    text: "Learn about travel safety, home safety and online safety.",
    button: "Read tips",
    iconBg: "from-rose to-pink-300 shadow-rose/30",
    hover: "hover:border-rose/40 hover:shadow-rose/15",
  },
  {
    to: "/helplines",
    icon: PhoneCall,
    title: "Emergency Helplines",
    text: "Access important official emergency contact numbers.",
    button: "View numbers",
    iconBg: "from-safe to-teal-400 shadow-safe/30",
    hover: "hover:border-safe/40 hover:shadow-safe/15",
  },
];

// Home page shows these three safety categories (in this order)
const awarenessIds = ["travel", "home", "cyber"];

export default function Home() {
  const awareness = awarenessIds
    .map((id) => safetyCategories.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <div>
      {/* ---------- 1. Hero ---------- */}
      <section className="relative overflow-hidden rounded-[2rem] border border-line bg-linear-to-br from-lavender via-white to-blush px-6 py-12 shadow-xl shadow-berry/10 sm:px-12 sm:py-16">
        <div aria-hidden="true" className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-berry/20 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-rose/20 blur-3xl" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(#c4b5fd 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        <div className="relative grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-berry/20 bg-white/80 px-4 py-1.5 text-sm font-semibold text-berry shadow-sm backdrop-blur">
              <Sparkles size={16} aria-hidden="true" /> Your Safety Companion
            </span>

            <h1 className="mt-5 bg-linear-to-r from-ink via-berry to-rose bg-clip-text pb-2 font-display text-4xl font-extrabold leading-[1.08] text-transparent sm:text-5xl lg:text-6xl">
              <span className="block">Your Safety,</span>
              <span className="block">Your Voice,</span>
              <span className="block">Your Power.</span>
            </h1>

            <p className="mt-5 max-w-lg text-lg text-muted">
              Your safety matters. SWARA brings emergency assistance, crime reporting,
              trusted contact support and safety awareness together in one accessible
              platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/sos"
                className={`inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-alert to-rose px-6 py-3.5 font-bold text-white shadow-lg shadow-alert/30 transition duration-300 motion-safe:hover:-translate-y-0.5 hover:shadow-xl hover:shadow-alert/40 active:translate-y-0 ${focusRing}`}
              >
                <Siren size={20} aria-hidden="true" /> Emergency SOS
              </Link>
              <Link
                to="/report"
                className={`inline-flex items-center justify-center gap-2 rounded-xl border-2 border-berry bg-white px-6 py-3.5 font-bold text-berry transition duration-300 motion-safe:hover:-translate-y-0.5 hover:bg-berry hover:text-white active:translate-y-0 ${focusRing}`}
              >
                <FileText size={20} aria-hidden="true" /> Report a Crime
              </Link>
            </div>

            <p className="mt-5 text-sm text-muted">
              Free to use. No login needed. In immediate danger, call{" "}
              <a href="tel:112" className={`rounded font-bold text-alert underline ${focusRing}`}>
                112
              </a>
              .
            </p>
          </div>

          <div className="animate-fade-up fade-delay-1">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ---------- 2. Main features ---------- */}
      <section className="mt-20" aria-labelledby="features-heading">
        <SectionHeading id="features-heading" title="Everything you need, in one place" eyebrow="What SWARA offers">
          Pick what you need right now. Each section opens in one tap.
        </SectionHeading>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ to, icon: Icon, title, text, button, iconBg, hover }) => (
            <Link
              key={to}
              to={to}
              className={`group flex flex-col rounded-3xl border border-line bg-white p-6 shadow-sm shadow-berry/5 transition duration-300 motion-safe:hover:-translate-y-1.5 hover:shadow-xl ${hover} ${focusRing}`}
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg transition duration-300 group-hover:scale-110 group-hover:rotate-3 ${iconBg}`}
              >
                <Icon size={26} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-ink">{title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted">{text}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-berry">
                {button}
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- 3. Trusted emergency contacts ---------- */}
      <section id="contacts" className="mt-20 scroll-mt-24" aria-labelledby="contacts-heading">
        <SectionHeading id="contacts-heading" title="Trusted emergency contacts" eyebrow="Set up once">
          Save up to five people you trust. When you use the SOS page, you can share
          your location with them in a tap. SWARA never sends messages by itself.
        </SectionHeading>
        <TrustedContacts />
      </section>

      {/* ---------- 4. How SWARA works ---------- */}
      <HowItWorks />

      {/* ---------- 5. Emergency helplines ---------- */}
      <section id="emergency-numbers" className="mt-20 scroll-mt-24" aria-labelledby="helplines-heading">
        <SectionHeading id="helplines-heading" title="Emergency helplines" eyebrow="Call anytime">
          Official numbers you can call right now. Tap a button to open your phone dialer.
        </SectionHeading>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {helplines.map((h) => (
            <HelplineCard key={h.number} h={h} />
          ))}
        </div>

        <Link
          to="/helplines"
          className={`mt-6 inline-flex items-center gap-1 rounded text-sm font-bold text-berry hover:underline ${focusRing}`}
        >
          See all helplines <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      {/* ---------- 6. Safety awareness ---------- */}
      <section id="awareness" className="mt-20 scroll-mt-24" aria-labelledby="awareness-heading">
        <SectionHeading id="awareness-heading" title="Safety awareness" eyebrow="Stay prepared">
          Simple knowledge that helps you stay prepared when you travel, at home and online.
        </SectionHeading>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {awareness.map(({ id, title, icon: Icon, iconBg, intro, tips }) => (
            <article
              key={id}
              className="rounded-3xl border border-line bg-white p-6 shadow-sm shadow-berry/5 transition duration-300 motion-safe:hover:-translate-y-1 hover:border-berry/40 hover:shadow-xl hover:shadow-berry/15"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg shadow-berry/20 ${iconBg}`}
              >
                <Icon size={26} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-ink">{title}</h3>
              <p className="mt-1 text-sm text-muted">{intro}</p>
              <ul className="mt-4 space-y-3 text-sm text-ink">
                {tips.slice(0, 4).map((tip) => (
                  <li key={tip} className="flex gap-2.5">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-safe" aria-hidden="true" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <Link
          to="/tips"
          className={`mt-6 inline-flex items-center gap-1 rounded text-sm font-bold text-berry hover:underline ${focusRing}`}
        >
          Read all safety tips <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
