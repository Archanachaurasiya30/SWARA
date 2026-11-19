import { ShieldCheck, Bus, Home, Laptop } from "lucide-react";

// Safety awareness content used on the Home page (Travel, Home and Online cards, first 4 tips each)
// and on the Safety Tips page (all categories, all tips).
// "iconBg" is the gradient behind each icon.
export const safetyCategories = [
  {
    id: "personal",
    title: "Personal Safety",
    icon: ShieldCheck,
    tint: "bg-lavender text-berry",
    iconBg: "from-berry to-violet-500",
    intro: "Everyday habits that keep you prepared.",
    tips: [
      "Trust your instincts. If a person or place feels wrong, leave and move to a public place.",
      "Keep your phone charged and your emergency contacts easy to reach.",
      "Tell someone you trust where you are going and when you expect to be back.",
      "Check who is at the door before you open it.",
      "Keep important numbers written down in case your phone is lost or dead.",
      "Be careful with food and drinks offered by people you do not know well.",
    ],
  },
  {
    id: "travel",
    title: "Travel Safety",
    icon: Bus,
    tint: "bg-blush text-rose",
    iconBg: "from-rose to-pink-300",
    intro: "Smart choices when you are on the move.",
    tips: [
      "Prefer well-lit, busy routes, especially after dark.",
      "Before you board a cab or auto, share the vehicle number and driver details with someone you trust.",
      "Match the cab number and driver with the app before you get in.",
      "Share your live location with a trusted person when you travel alone.",
      "If you feel unsafe, move towards a crowded place, a shop or a police booth.",
      "Keep your bag and phone close and stay aware of your surroundings.",
    ],
  },
  {
    id: "home",
    title: "Home Safety",
    icon: Home,
    tint: "bg-teal-50 text-safe",
    iconBg: "from-safe to-teal-400",
    intro: "Make the place you live feel secure.",
    tips: [
      "Lock doors and windows at night and whenever you are alone at home.",
      "Ask for ID before letting delivery or repair staff inside, and check with the company if unsure.",
      "Keep entrances well lit and know who your nearby neighbours are.",
      "Keep emergency numbers where you can see them, such as on the fridge or near the door.",
      "Avoid posting on social media that you are home alone or away on a trip.",
      "Have a plan: know where you would go and who you would call if you felt unsafe.",
    ],
  },
  {
    id: "cyber",
    title: "Online Safety",
    icon: Laptop,
    tint: "bg-lavender text-berry",
    iconBg: "from-violet-500 to-berry",
    intro: "Protect yourself and your money online.",
    tips: [
      "Never share OTPs, PINs or passwords with anyone, even if they claim to be from a bank.",
      "Do not share your address, live location or private photos with people you only know online.",
      "Use strong, different passwords and turn on two-step verification.",
      "Take screenshots of threats or harassment before you block the account, and report them.",
      "Report cyber financial fraud quickly on 1930 or at cybercrime.gov.in.",
      "Think before clicking unknown links, even when they come from a friend's account.",
    ],
  },
];
