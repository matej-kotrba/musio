// Id handling
// ****
export function getRandomId() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}
// ****

// Dev utils
// ****
export function isDev() {
  return process.env.NODE_ENV === "development";
}
// ****
