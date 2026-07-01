// Lightweight analytics stub — swap for a real analytics SDK when one is wired up.
export function track(event, properties = {}) {
  console.info(`[track] ${event}`, properties);
}
