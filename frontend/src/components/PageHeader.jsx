// The banner at the top of the inner pages (Helplines, Safety Tips, SOS ...).
// Pass any Lucide icon and it gets the same gradient badge everywhere.
export default function PageHeader({ icon: Icon, title, children, iconClass = "from-berry to-rose", align = "left" }) {
  const centered = align === "center";
  return (
    <header className={`animate-fade-up ${centered ? "text-center" : ""}`}>
      <span
        className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg shadow-berry/20 ${iconClass}`}
      >
        <Icon size={28} aria-hidden="true" />
      </span>
      <h1 className="mt-4 font-display text-3xl font-extrabold text-ink sm:text-4xl">{title}</h1>
      {children && (
        <p className={`mt-2 max-w-xl text-muted ${centered ? "mx-auto" : ""}`}>{children}</p>
      )}
    </header>
  );
}
