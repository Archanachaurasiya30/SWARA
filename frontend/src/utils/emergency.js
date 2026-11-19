// Checks if a message sounds like immediate danger (English, Hindi and Hinglish).
// This runs in the browser, so the 112 / SOS banner appears instantly and does not wait for any AI.
// It only SHOWS the banner. It never calls anyone, sends an alert or shares your location.
// (The same list exists in ai-backend/src/utils/emergency.js. Update both together.)
const patterns = [
  /\bhelp me\b/i,
  /\bsave me\b/i,
  /\b(being|am being|is|are) (followed|stalked|chased)\b/i,
  /\bfollowing me\b/i,
  /\bpeecha\b|\bpichha\b|\bpeechha\b/i,
  /\b(attack|attacked|attacking)\b/i,
  /\b(kidnap|kidnapped|abduct|abducted)\b/i,
  /\b(rape|raped|molest|molested|assault|assaulted)\b/i,
  /\b(kill me|going to kill|threaten(ed|ing)? to kill|beat me|hitting me|beating me)\b/i,
  /\b(knife|gun|weapon)\b/i,
  /\b(break|breaking|broke) in\b|\bbreaking into\b/i,
  /\b(locked me|trapped|can'?t (get out|escape))\b/i,
  /\b(unsafe|in danger|danger)\b.*\b(right now|now|abhi)\b/i,
  /\bbachao\b|\bbachaao\b/i,
  /\b(maar (dega|dalega|dunga)|jaan se|chaku|bandook|hamla|apaharan)\b/i,
  /\b(zabardasti|chhed ?chhad|chhedchhad)\b/i,
  /बचाओ|मदद करो|पीछा कर|मार (देगा|डालेगा)|जान से|चाकू|बंदूक|हमला|अपहरण|जबरदस्ती|छेड़छाड़|बलात्कार/,
];

export function detectEmergency(text = "") {
  return patterns.some((p) => p.test(String(text)));
}
