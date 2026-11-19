// Simple keyword check for messages that sound like immediate danger.
// It works in English, Hindi (Devanagari) and Hinglish (Hindi in English letters).
// It runs on the server too, so emergency guidance still appears if the AI service is down.
// It is only a helper to show the 112 / SOS banner. It is not a diagnosis of anything.
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

// Used only when an emergency message arrives and the AI service fails.
export const emergencyFallbackReply =
  "If you are in immediate danger, call 112 now. Move to a crowded, well-lit place and tell someone nearby. " +
  "You can also open the SOS page in SWARA to see your location and share it yourself.\n\n" +
  "अगर आप तुरंत खतरे में हैं, तो अभी 112 पर कॉल करें। भीड़-भाड़ वाली, रोशनी वाली जगह पर जाएँ और पास के किसी व्यक्ति को बताएँ। " +
  "SWARA का SOS पेज खोलकर आप अपनी लोकेशन देख और खुद शेयर कर सकती हैं।";
