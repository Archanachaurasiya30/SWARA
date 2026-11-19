import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Siren,
  MapPin,
  Phone,
  MessageCircle,
  MessageSquare,
  Copy,
  Check,
  Loader2,
  Info,
  Users,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Clock,
  UserPlus,
} from "lucide-react";
import ContactAvatar from "../components/ContactAvatar";
import { loadContacts, formatPhone } from "../utils/contactsStorage";
import { focusRing } from "../utils/ui";

const errorMessages = {
  1: "Location access was blocked. Allow location for this site in your browser settings, then tap SOS again.",
  2: "Your location could not be found. Check that GPS or Wi-Fi is on and try again.",
  3: "Finding your location took too long. Try again.",
};

// Shared look for the action buttons
const actionClass = `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition motion-safe:hover:-translate-y-0.5 ${focusRing}`;
// Same size, but greyed out (used before a location is available)
const disabledClass =
  "inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-mist px-4 py-2.5 text-sm font-semibold text-muted";

export default function EmergencySOS() {
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [capturedAt, setCapturedAt] = useState(null);
  const [contacts] = useState(loadContacts); // trusted contacts saved on the Home page

  // The browser shows its own permission prompt when this runs.
  // It reads your position ONCE. It does not keep tracking you.
  const handleSOS = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("This browser does not support location. Call 112 now.");
      return;
    }
    setStatus("loading");
    setError("");
    setCopied(false);
    setCopyError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        });
        setCapturedAt(new Date());
        setStatus("done");
      },
      (err) => {
        setStatus("error");
        setError(errorMessages[err.code] || "Could not get your location.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const hasLocation = status === "done" && location;
  const mapLink = location ? `https://www.google.com/maps?q=${location.lat},${location.lng}` : "";
  const message = `I need help! My current location: ${mapLink}`;
  const encoded = encodeURIComponent(message);

  const copyLink = async () => {
    setCopyError("");
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError("Could not copy automatically. Select the message above and copy it manually.");
    }
  };

  return (
    <div>
      {/* ---------- Title ---------- */}
      <header className="animate-fade-up text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">Emergency SOS</h1>
        <p className="mx-auto mt-2 max-w-md text-muted">
          Tap the button to find your location, then share it with someone you trust.
        </p>
      </header>

      {/* ---------- Permission and honesty notice, shown before anything happens ---------- */}
      <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-berry/15 bg-lavender/60 px-4 py-4 text-sm text-ink">
        <Info size={20} className="mt-0.5 shrink-0 text-berry" aria-hidden="true" />
        <div>
          <p className="font-semibold">Why SWARA asks for your location</p>
          <p className="mt-1 text-muted">
            When you tap SOS, your browser will ask for permission to use your location. It is
            read one time, only to show your position and prepare a message. It is not tracked,
            not saved and not sent to our server. SWARA does not send any alert by itself.
          </p>
        </div>
      </div>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
        {/* ---------- Left: SOS button ---------- */}
        <div className="flex flex-col items-center rounded-3xl border border-line bg-white p-6 text-center shadow-sm shadow-berry/5 sm:p-8">
          <div className="relative flex h-56 w-56 items-center justify-center">
            {status === "idle" && (
              <>
                <span className="motion-safe:animate-ping absolute inset-4 rounded-full bg-alert/25" />
                <span className="absolute inset-0 rounded-full bg-alert/10" />
              </>
            )}
            <button
              type="button"
              onClick={handleSOS}
              disabled={status === "loading"}
              aria-label="Get my location for SOS"
              className="relative flex h-44 w-44 flex-col items-center justify-center rounded-full bg-linear-to-br from-alert to-rose text-white shadow-2xl shadow-alert/40 ring-8 ring-alert/15 transition hover:shadow-alert/60 hover:ring-alert/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-berry focus-visible:ring-offset-4 active:scale-95 disabled:opacity-80"
            >
              {status === "loading" ? (
                <Loader2 size={48} className="motion-safe:animate-spin" aria-hidden="true" />
              ) : (
                <Siren size={52} aria-hidden="true" />
              )}
              <span className="mt-1 font-display text-3xl font-extrabold">
                {status === "loading" ? "Locating" : "SOS"}
              </span>
            </button>
          </div>

          <p className="mt-4 text-sm text-muted">
            {status === "idle" && "Tap SOS to find your current location."}
            {status === "loading" && "Finding your location. Please allow access if your browser asks."}
            {status === "done" && "Location found. Choose how to share it."}
            {status === "error" && "We could not get your location."}
          </p>

          <a
            href="tel:112"
            className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-alert px-5 py-3 font-bold text-alert transition hover:bg-alert hover:text-white ${focusRing}`}
          >
            <Phone size={18} aria-hidden="true" /> Call 112 now
          </a>
        </div>

        {/* ---------- Right: status and location card ---------- */}
        <div aria-live="polite" className="min-w-0">
          {status === "idle" && (
            <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-berry/30 bg-mist p-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-berry shadow-sm">
                <MapPin size={26} aria-hidden="true" />
              </span>
              <p className="mt-3 font-display text-lg font-bold text-ink">Your location will appear here</p>
              <p className="mt-1 max-w-sm text-sm text-muted">
                You will see a map, your coordinates and ready-to-share messages after you tap SOS.
              </p>
            </div>
          )}

          {status === "loading" && (
            <div
              role="status"
              className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-line bg-white p-8 text-center shadow-sm"
            >
              <Loader2 size={36} className="motion-safe:animate-spin text-berry" aria-hidden="true" />
              <p className="mt-3 font-display text-lg font-bold text-ink">Finding your location...</p>
              <p className="mt-1 max-w-sm text-sm text-muted">
                This can take up to 15 seconds. If your browser asks, choose Allow.
              </p>
            </div>
          )}

          {status === "error" && (
            <div
              role="alert"
              className="rounded-3xl border border-red-200 bg-red-50 p-6 sm:p-8"
            >
              <p className="flex items-center gap-2 font-display text-lg font-bold text-alert-dark">
                <AlertTriangle size={22} aria-hidden="true" /> Location unavailable
              </p>
              <p className="mt-2 text-alert-dark">{error}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSOS}
                  className={`${actionClass} bg-alert hover:bg-alert-dark`}
                >
                  <RefreshCw size={18} aria-hidden="true" /> Try again
                </button>
                <a href="tel:112" className={`${actionClass} bg-ink hover:bg-black`}>
                  <Phone size={18} aria-hidden="true" /> Call 112
                </a>
              </div>
            </div>
          )}

          {hasLocation && (
            <section
              aria-labelledby="location-heading"
              className="overflow-hidden rounded-3xl border border-line bg-white shadow-lg shadow-berry/10"
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 id="location-heading" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-safe">
                      <MapPin size={18} aria-hidden="true" />
                    </span>
                    Your current location
                  </h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-lavender px-3 py-1 text-xs font-semibold text-berry">
                    <Clock size={14} aria-hidden="true" />
                    Taken at {capturedAt?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">
                  This is a one-time reading. It does not update if you move. Tap &quot;Update my
                  location&quot; to read it again.
                </p>

                {/* Latitude, longitude and accuracy */}
                <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-mist px-4 py-3">
                    <dt className="text-xs font-semibold text-muted">Latitude</dt>
                    <dd className="mt-0.5 font-bold text-ink">{location.lat.toFixed(6)}</dd>
                  </div>
                  <div className="rounded-2xl bg-mist px-4 py-3">
                    <dt className="text-xs font-semibold text-muted">Longitude</dt>
                    <dd className="mt-0.5 font-bold text-ink">{location.lng.toFixed(6)}</dd>
                  </div>
                  <div className="rounded-2xl bg-mist px-4 py-3">
                    <dt className="text-xs font-semibold text-muted">Accuracy</dt>
                    <dd className="mt-0.5 font-bold text-ink">About {location.accuracy} m</dd>
                  </div>
                </dl>
              </div>

              {/* Map preview */}
              <iframe
                title="Your location on the map"
                className="h-64 w-full border-y border-line"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=16&output=embed`}
              />

              <div className="p-5 sm:p-6">
                {/* The message that will be shared */}
                <p className="text-xs font-semibold text-muted">Message that will be shared</p>
                <p className="mt-1 break-words rounded-2xl border border-line bg-mist px-4 py-3 text-sm text-ink">
                  {message}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={copyLink}
                    className={`${actionClass} bg-ink hover:bg-black`}
                  >
                    {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                    {copied ? "Copied" : "Copy location message"}
                  </button>
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className={`${actionClass} bg-safe hover:bg-teal-800`}
                  >
                    <ExternalLink size={18} aria-hidden="true" /> Open in Google Maps
                  </a>
                  <a
                    href={`https://wa.me/?text=${encoded}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`${actionClass} bg-green-600 hover:bg-green-700`}
                  >
                    <MessageCircle size={18} aria-hidden="true" /> Share on WhatsApp
                  </a>
                  <a
                    href={`sms:?&body=${encoded}`}
                    className={`${actionClass} bg-berry hover:bg-berry-dark`}
                  >
                    <MessageSquare size={18} aria-hidden="true" /> Send by SMS
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleSOS}
                  className={`mt-3 inline-flex items-center gap-2 rounded text-sm font-semibold text-berry hover:underline ${focusRing}`}
                >
                  <RefreshCw size={16} aria-hidden="true" /> Update my location
                </button>

                {copyError && (
                  <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-alert-dark">
                    {copyError}
                  </p>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ---------- Saved trusted contacts (from the Home page) ---------- */}
      <section aria-labelledby="sos-contacts-heading" className="mt-12">
        <h2 id="sos-contacts-heading" className="flex items-center gap-3 font-display text-xl font-bold text-ink">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lavender text-berry">
            <Users size={20} aria-hidden="true" />
          </span>
          Share with your trusted contacts
        </h2>

        {contacts.length === 0 ? (
          <div className="mt-4 flex flex-col items-start gap-4 rounded-3xl border border-dashed border-berry/30 bg-mist p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm text-muted">
              You have not saved any trusted contacts yet. Add up to 5 contacts to share your
              location with them faster next time.
            </p>
            <Link
              to="/#contacts"
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl bg-berry px-5 py-2.5 text-sm font-bold text-white transition hover:bg-berry-dark ${focusRing}`}
            >
              <UserPlus size={18} aria-hidden="true" /> Add contacts
            </Link>
          </div>
        ) : (
          <>
            {!hasLocation && (
              <p className="mt-3 text-sm text-muted">
                WhatsApp and SMS unlock after you tap SOS and your location is found. You can call
                a contact at any time.
              </p>
            )}
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {contacts.map((c, i) => (
                <li
                  key={c.id}
                  className="rounded-3xl border border-line bg-white p-5 shadow-sm shadow-berry/5 transition hover:border-berry/40 hover:shadow-lg hover:shadow-berry/10"
                >
                  <div className="flex items-center gap-3">
                    <ContactAvatar name={c.name} index={i} />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-ink">{c.name}</p>
                      <p className="truncate text-sm font-medium text-berry">{c.relationship}</p>
                      <p className="truncate text-sm text-muted">{formatPhone(c.phone)}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {hasLocation ? (
                      <a
                        href={`https://wa.me/91${c.phone}?text=${encoded}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open WhatsApp to message ${c.name}`}
                        className={`${actionClass} bg-green-600 hover:bg-green-700`}
                      >
                        <MessageCircle size={16} aria-hidden="true" /> WhatsApp
                      </a>
                    ) : (
                      <span aria-disabled="true" className={disabledClass}>
                        <MessageCircle size={16} aria-hidden="true" /> WhatsApp
                      </span>
                    )}
                    {hasLocation ? (
                      <a
                        href={`sms:+91${c.phone}?&body=${encoded}`}
                        aria-label={`Open SMS to message ${c.name}`}
                        className={`${actionClass} bg-berry hover:bg-berry-dark`}
                      >
                        <MessageSquare size={16} aria-hidden="true" /> SMS
                      </a>
                    ) : (
                      <span aria-disabled="true" className={disabledClass}>
                        <MessageSquare size={16} aria-hidden="true" /> SMS
                      </span>
                    )}
                    <a
                      href={`tel:+91${c.phone}`}
                      aria-label={`Call ${c.name}`}
                      className={`${actionClass} bg-safe hover:bg-teal-800`}
                    >
                      <Phone size={16} aria-hidden="true" /> Call
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-4 flex items-start gap-2 text-xs text-muted">
          <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          These buttons only open WhatsApp or your messaging app with the message ready. The
          message is sent only when you press send there.
        </p>
      </section>
    </div>
  );
}
