// Trusted contacts are saved in the browser (localStorage) only.
// Nothing here is sent to a server. Later, this file can be swapped for API calls.
const KEY = "swara_trusted_contacts";
export const MAX_CONTACTS = 5;

// Turns "+91 98765-43210" or "098765 43210" into plain 10 digits
export function cleanPhone(value) {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

// Indian mobile numbers are 10 digits and start with 6, 7, 8 or 9
export function isValidPhone(digits) {
  return /^[6-9]\d{9}$/.test(digits);
}

export function formatPhone(digits) {
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function loadContacts() {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return [];
    return list
      .filter((c) => c && c.id && c.name && isValidPhone(String(c.phone)))
      .slice(0, MAX_CONTACTS);
  } catch {
    return [];
  }
}

// Returns true if saved, false if the browser blocked storage
export function saveContacts(contacts) {
  try {
    localStorage.setItem(KEY, JSON.stringify(contacts));
    return true;
  } catch {
    return false;
  }
}
