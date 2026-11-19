import { useState } from "react";
import { UserPlus, Pencil, Trash2, Phone, Save, X, Users, ShieldCheck } from "lucide-react";
import ContactAvatar from "./ContactAvatar";
import { focusRing } from "../utils/ui";
import {
  MAX_CONTACTS,
  loadContacts,
  saveContacts,
  cleanPhone,
  isValidPhone,
  formatPhone,
} from "../utils/contactsStorage";

const emptyForm = { name: "", relationship: "", phone: "" };

const inputClass =
  `w-full rounded-xl border border-line bg-white px-4 py-3 text-ink transition placeholder:text-muted/60 focus:border-berry disabled:bg-mist disabled:text-muted ${focusRing}`;

export default function TrustedContacts() {
  const [contacts, setContacts] = useState(loadContacts); // read once from localStorage
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null = adding a new contact
  const [error, setError] = useState("");

  const isFull = contacts.length >= MAX_CONTACTS && editingId === null;

  // Update the list on screen and in localStorage together
  const update = (next) => {
    setContacts(next);
    if (!saveContacts(next)) {
      setError("Could not save in this browser. Check that site data is not blocked.");
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const relationship = form.relationship.trim();
    const phone = cleanPhone(form.phone);

    if (!isValidPhone(phone)) {
      setError("Enter a valid 10-digit Indian mobile number that starts with 6, 7, 8 or 9.");
      return;
    }
    if (contacts.some((c) => c.phone === phone && c.id !== editingId)) {
      setError("This number is already saved.");
      return;
    }

    if (editingId) {
      update(contacts.map((c) => (c.id === editingId ? { ...c, name, relationship, phone } : c)));
    } else {
      if (contacts.length >= MAX_CONTACTS) {
        setError(`You can save up to ${MAX_CONTACTS} contacts.`);
        return;
      }
      update([...contacts, { id: Date.now().toString(), name, relationship, phone }]);
    }
    resetForm();
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name, relationship: c.relationship || "", phone: c.phone });
    setError("");
  };

  const handleDelete = (c) => {
    if (!window.confirm(`Delete ${c.name} from your trusted contacts?`)) return;
    update(contacts.filter((x) => x.id !== c.id));
    if (editingId === c.id) resetForm();
  };

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      {/* ---------- Add / edit form ---------- */}
      <form
        onSubmit={handleSubmit}
        aria-label="Trusted contact form"
        className="space-y-4 rounded-3xl border border-line bg-white p-6 shadow-sm shadow-berry/5 sm:p-7"
      >
        <h3 className="flex items-center gap-3 font-display text-lg font-bold text-ink">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lavender text-berry">
            {editingId ? <Pencil size={20} aria-hidden="true" /> : <UserPlus size={20} aria-hidden="true" />}
          </span>
          {editingId ? "Edit contact" : "Add a trusted contact"}
        </h3>

        {isFull && (
          <p className="rounded-xl bg-lavender px-4 py-3 text-sm text-ink">
            You have saved the maximum of {MAX_CONTACTS} contacts. Delete one to add another.
          </p>
        )}

        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-semibold text-ink">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            maxLength={40}
            disabled={isFull}
            autoComplete="off"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="contact-relationship" className="mb-1.5 block text-sm font-semibold text-ink">
            Relationship
          </label>
          <input
            id="contact-relationship"
            name="relationship"
            value={form.relationship}
            onChange={handleChange}
            required
            maxLength={30}
            disabled={isFull}
            list="relationship-options"
            placeholder="For example: Mother, Friend, Sister"
            autoComplete="off"
            className={inputClass}
          />
          <datalist id="relationship-options">
            <option value="Mother" />
            <option value="Father" />
            <option value="Sister" />
            <option value="Brother" />
            <option value="Husband" />
            <option value="Friend" />
            <option value="Relative" />
          </datalist>
        </div>

        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-semibold text-ink">
            Mobile number
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={handleChange}
            required
            disabled={isFull}
            placeholder="98765 43210"
            autoComplete="off"
            className={inputClass}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-alert-dark">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isFull}
            className={`inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-berry to-violet-600 px-5 py-3 font-bold text-white shadow-md shadow-berry/25 transition motion-safe:hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md ${focusRing}`}
          >
            {editingId ? <Save size={18} aria-hidden="true" /> : <UserPlus size={18} aria-hidden="true" />}
            {editingId ? "Save changes" : "Add contact"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className={`inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 font-semibold text-ink transition hover:bg-mist ${focusRing}`}
            >
              <X size={18} aria-hidden="true" /> Cancel
            </button>
          )}
        </div>
      </form>

      {/* ---------- Saved contacts ---------- */}
      <div className="flex flex-col rounded-3xl border border-line bg-white p-6 shadow-sm shadow-berry/5 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-3 font-display text-lg font-bold text-ink">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lavender text-berry">
              <Users size={20} aria-hidden="true" />
            </span>
            Your contacts
          </h3>
          <span className="rounded-full bg-lavender px-3 py-1 text-sm font-bold text-berry">
            {contacts.length}/{MAX_CONTACTS}
            <span className="sr-only"> contacts saved</span>
          </span>
        </div>

        {/* Progress indicator */}
        <div
          role="progressbar"
          aria-label="Trusted contacts saved"
          aria-valuemin={0}
          aria-valuemax={MAX_CONTACTS}
          aria-valuenow={contacts.length}
          aria-valuetext={`${contacts.length} of ${MAX_CONTACTS} contacts saved`}
          className="mt-4 h-2.5 overflow-hidden rounded-full bg-lavender"
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-berry to-rose transition-all duration-500"
            style={{ width: `${(contacts.length / MAX_CONTACTS) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          {contacts.length}/{MAX_CONTACTS} contacts saved
          {contacts.length === 0 && " · Add your first contact to get started"}
          {contacts.length === MAX_CONTACTS && " · You are all set"}
        </p>

        {contacts.length === 0 ? (
          <div className="mt-5 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-berry/30 bg-mist px-4 py-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-berry shadow-sm">
              <Users size={22} aria-hidden="true" />
            </span>
            <p className="mt-3 font-semibold text-ink">No contacts yet</p>
            <p className="mt-1 text-sm text-muted">Add someone you trust and they will show up here.</p>
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {contacts.map((c, i) => (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm shadow-berry/5 transition hover:border-berry/40 hover:bg-mist hover:shadow-md"
              >
                <ContactAvatar name={c.name} index={i} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink">{c.name}</p>
                  <p className="truncate text-sm font-medium text-berry">{c.relationship}</p>
                  <p className="truncate text-sm text-muted">{formatPhone(c.phone)}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <a
                    href={`tel:+91${c.phone}`}
                    aria-label={`Call ${c.name}`}
                    className={`rounded-lg p-2.5 text-safe transition hover:bg-teal-50 ${focusRing}`}
                  >
                    <Phone size={18} aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    onClick={() => startEdit(c)}
                    aria-label={`Edit ${c.name}`}
                    className={`rounded-lg p-2.5 text-berry transition hover:bg-lavender ${focusRing}`}
                  >
                    <Pencil size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
                    aria-label={`Delete ${c.name}`}
                    className={`rounded-lg p-2.5 text-alert transition hover:bg-red-50 ${focusRing}`}
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Privacy information (accurate: browser storage only) */}
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-lavender/60 p-4 text-sm text-ink">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-berry" aria-hidden="true" />
          <p>
            <span className="font-semibold">Your contacts stay private.</span> They are saved only in this
            browser on this device. They are not sent to any server, and SWARA never messages them by itself.
          </p>
        </div>
      </div>
    </div>
  );
}
