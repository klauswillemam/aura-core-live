// Lightweight pub/sub bridge between PsyMatrix chat and the CORA cockpit.
// Keeps both panels decoupled while letting the chat push actions into the queue.

import type { ClinicalAction } from "@/data/aureaMock";

const EVENT = "cora:enqueue";

export function emitCoraAction(action: ClinicalAction) {
  window.dispatchEvent(new CustomEvent<ClinicalAction>(EVENT, { detail: action }));
}

export function onCoraAction(handler: (action: ClinicalAction) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<ClinicalAction>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
