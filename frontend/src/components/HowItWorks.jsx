import { UserPlus, Siren, MapPin } from "lucide-react";
import SectionHeading from "./SectionHeading";

// These three steps really are a sequence, so they are numbered.
const steps = [
  {
    icon: UserPlus,
    title: "Save trusted contacts",
    text: "Add up to five people you trust. They stay in your browser on this device.",
    bg: "from-berry to-violet-500",
  },
  {
    icon: Siren,
    title: "Access emergency assistance",
    text: "Open the SOS page to call 112 right away, or use the other helpline numbers.",
    bg: "from-alert to-rose",
  },
  {
    icon: MapPin,
    title: "Share your current location",
    text: "SWARA finds your position once and prepares a message. You choose who gets it and press send yourself.",
    bg: "from-safe to-teal-400",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mt-20 scroll-mt-24" aria-labelledby="how-heading">
      <SectionHeading id="how-heading" title="How SWARA works" eyebrow="Simple by design">
        Three quick steps. Do the first one now, so everything is ready if you ever need it.
      </SectionHeading>

      <ol className="mt-8 grid gap-5 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text, bg }, i) => (
          <li
            key={title}
            className="relative rounded-3xl border border-line bg-white p-6 shadow-sm shadow-berry/5"
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg shadow-berry/20 ${bg}`}
              >
                <Icon size={26} aria-hidden="true" />
              </span>
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-lavender font-display text-lg font-extrabold text-berry"
              >
                {i + 1}
              </span>
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-ink">
              <span className="sr-only">Step {i + 1}: </span>
              {title}
            </h3>
            <p className="mt-1 text-sm text-muted">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
