export function iconNameToDisplayName(icon: string) {
  return icon.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
