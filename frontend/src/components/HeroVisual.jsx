import { MapPin, Lock, Users } from "lucide-react";

// A decorative phone illustration for the hero. It is only a picture (no real alert is sent).
export default function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-[27rem] w-full max-w-xs">
      {/* soft glow behind the phone */}
      <div className="absolute inset-x-4 top-10 bottom-2 rounded-[3rem] bg-linear-to-br from-berry/35 to-rose/30 blur-2xl" />

      {/* phone */}
      <div className="relative mx-auto h-full w-56 overflow-hidden rounded-[2.5rem] border-[10px] border-ink bg-white shadow-2xl shadow-berry/30">
        <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-ink/20" />
        <p className="mt-3 text-center font-display font-bold text-ink">Emergency SOS</p>

        {/* mini map with a location pin */}
        <div className="relative mx-4 mt-3 h-28 overflow-hidden rounded-2xl bg-lavender">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(#d9c9f5 1px, transparent 1px), linear-gradient(90deg, #d9c9f5 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <span className="motion-safe:animate-ping absolute h-10 w-10 rounded-full bg-berry/30" />
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-berry text-white shadow-md">
              <MapPin size={16} />
            </span>
          </span>
        </div>

        {/* SOS button with soft rings */}
        <div className="relative mx-auto mt-5 flex h-24 w-24 items-center justify-center">
          <span className="motion-safe:animate-ping absolute inset-1 rounded-full bg-alert/25" />
          <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-alert to-rose font-display text-2xl font-extrabold text-white shadow-lg shadow-alert/40 ring-8 ring-alert/15">
            SOS
          </span>
        </div>

        {/* trusted contacts row */}
        <div className="mx-4 mt-5 flex items-center gap-2 rounded-xl bg-mist px-3 py-2">
          <span className="flex -space-x-2">
            <span className="h-6 w-6 rounded-full border-2 border-white bg-berry" />
            <span className="h-6 w-6 rounded-full border-2 border-white bg-rose" />
            <span className="h-6 w-6 rounded-full border-2 border-white bg-safe" />
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-ink">
            <Users size={12} /> Trusted contacts
          </span>
        </div>
      </div>

      {/* floating labels (accurate: a one-time location, not live tracking) */}
      <div className="animate-float absolute left-0 top-16 flex items-center gap-2 rounded-full border border-line bg-white py-2 pl-2 pr-4 text-sm font-semibold shadow-lg sm:-left-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lavender text-berry">
          <MapPin size={16} />
        </span>
        Share your location
      </div>
      <div className="animate-float-slow absolute bottom-16 right-0 flex items-center gap-2 rounded-full border border-line bg-white py-2 pl-2 pr-4 text-sm font-semibold shadow-lg sm:-right-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blush text-rose">
          <Lock size={16} />
        </span>
        No login needed
      </div>
    </div>
  );
}
