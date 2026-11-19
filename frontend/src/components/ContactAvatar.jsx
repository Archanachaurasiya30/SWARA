// Circular avatar with the contact's first initial.
// "index" picks a colour so neighbouring contacts look different.
const colours = [
  "from-berry to-rose",
  "from-rose to-pink-300",
  "from-violet-500 to-berry",
  "from-safe to-teal-400",
  "from-fuchsia-500 to-berry",
];

export default function ContactAvatar({ name, index = 0, size = "h-12 w-12 text-lg" }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-linear-to-br font-bold text-white shadow-md shadow-berry/20 ${colours[index % colours.length]} ${size}`}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
