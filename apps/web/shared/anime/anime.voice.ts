/**
 * Deterministic voice-command prefix stripping.
 *
 * Voice produces text. This function only removes known travel prefixes
 * before the existing resolver runs. It is not a second matcher.
 */

const VOICE_COMMAND_PREFIXES = [
  /^give me\s+/i,
  /^i want to enter\s+/i,
  /^i want to watch\s+/i,
  /^i want to see\s+/i,
  /^take me into\s+/i,
  /^take me to\s+/i,
  /^bring me into\s+/i,
  /^bring me to\s+/i,
  /^show me\s+/i,
  /^go into\s+/i,
  /^go to\s+/i,
  /^open\s+/i,
  /^watch\s+/i,
] as const;

export function normalizeVoiceQuery(transcript: string): string {
  let value = transcript.trim();
  if (value.length === 0) return value;

  for (const prefix of VOICE_COMMAND_PREFIXES) {
    value = value.replace(prefix, '');
  }

  return value.replace(/[.!?]+$/u, '').trim();
}
