import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Shield, Siren, Menu, X } from "lucide-react";
import { focusRing } from "../utils/ui";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/report", label: "Report a Crime" },
  { to: "/tips", label: "Safety Tips" },
  { to: "/helplines", label: "Helplines" },
];

// NavLink gives us "isActive", so the current page is highlighted.
const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${focusRing} ${
    isActive ? "bg-lavender text-berry" : "text-ink hover:bg-mist hover:text-berry"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu after moving to another page
  useEffect(() => setOpen(false), [pathname]);

  // Close the mobile menu with the Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" aria-label="SWARA home" className={`flex items-center gap-2.5 rounded-xl ${focusRing}`}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-berry to-rose text-white shadow-md shadow-berry/30">
            <Shield size={22} aria-hidden="true" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-xl font-extrabold tracking-wide text-ink">SWARA</span>
            <span className="hidden text-[11px] font-medium text-muted sm:block">Women safety platform</span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* SOS button, always visible */}
          <Link
            to="/sos"
            className={`inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-alert to-rose px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-alert/30 transition duration-300 motion-safe:hover:-translate-y-0.5 hover:shadow-xl hover:shadow-alert/40 ${focusRing}`}
          >
            <Siren size={18} aria-hidden="true" /> SOS
          </Link>

          {/* Hamburger (mobile only) */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`rounded-xl border border-line p-2.5 text-ink transition hover:bg-mist md:hidden ${focusRing}`}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="animate-fade-up border-t border-line bg-white px-4 pb-4 pt-2 md:hidden"
        >
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className={(s) => `block text-base ${linkClass(s)}`}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
