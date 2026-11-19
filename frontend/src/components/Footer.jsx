import { Link } from "react-router-dom";
import { Shield, Lock } from "lucide-react";
import { helplines } from "../data/helplines";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/sos", label: "Emergency SOS" },
  { to: "/report", label: "Report a Crime" },
  { to: "/tips", label: "Safety Tips" },
  { to: "/helplines", label: "Helplines" },
  { to: "/#contacts", label: "Trusted Contacts" },
];

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        {/* About */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-berry to-rose text-white">
              <Shield size={20} aria-hidden="true" />
            </span>
            <span className="font-display text-xl font-extrabold">SWARA</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-ink">
            Smart Women Assistance, Reporting &amp; Alert System
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            A women safety platform that brings emergency assistance, crime reporting,
            trusted contacts and safety awareness together in one place.
          </p>
        </div>

        {/* Quick links */}
        <nav aria-label="Footer">
          <h2 className="font-display text-lg font-bold">Quick links</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="rounded text-muted transition-colors hover:text-berry focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berry focus-visible:ring-offset-2">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Helpline numbers */}
        <div>
          <h2 className="font-display text-lg font-bold">Emergency helplines</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {helplines.map((h) => (
              <li key={h.number} className="flex items-center gap-3">
                <a
                  href={`tel:${h.number}`}
                  className="w-14 shrink-0 rounded-md bg-lavender py-0.5 text-center font-bold text-berry transition-colors hover:bg-berry hover:text-white"
                >
                  {h.number}
                </a>
                <span className="text-muted">{h.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Privacy note and copyright */}
      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl space-y-2 px-4 py-4 text-xs text-muted sm:px-6">
          <p className="flex items-start gap-2">
            <Lock size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              Privacy: SWARA has no login. Your location is used only when you tap SOS and
              is not stored. Trusted contacts stay in your browser. Crime reports you submit
              are saved in the project database. The optional AI features send only the text you choose to write (or the topic you pick) to Google Gemini, and SWARA does not store chats.
            </span>
          </p>
          <p>© {new Date().getFullYear()} SWARA mini project. In immediate danger, call 112.</p>
        </div>
      </div>
    </footer>
  );
}
