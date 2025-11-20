export function parseLlmJson(text: string): any {
  try {
    let clean = text.trim();
    // Remove markdown code blocks if present
    if (clean.startsWith("```")) {
      clean = clean.replace(/```(?:json)?\n?/, "").replace(/```$/, "").trim();
    }
    return JSON.parse(clean);
  } catch (e) {
    // If parsing fails, return null or throw
    return null;
  }
}
