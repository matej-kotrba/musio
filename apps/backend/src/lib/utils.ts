// Id handling
// ****
export function getRandomId() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}
// ****

// Dev utils
// ****
export function isDev() {
  console.log(process.env.NODE_ENV);
  return process.env.NODE_ENV === "development";
}
// ****

// Random utils
// ****
export function shuffleArray<T extends unknown[]>(arr: T) {
  const newArr = [...arr];

  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }

  return newArr;
}
// ****
