// A reusable heading + short description used for every section on the Home page.
// "eyebrow" is an optional small pill above the title.
export default function SectionHeading({ id, title, eyebrow, children }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-lavender px-3 py-1 text-sm font-semibold text-berry">
          {eyebrow}
        </span>
      )}
      <h2 id={id} className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
        {title}
      </h2>
      {children && <p className="mt-2 text-muted">{children}</p>}
    </div>
  );
}
