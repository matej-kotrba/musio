// TODO: This file does not see the .env as it's not in the same folder, figure out a better way
export const getServerURL = (environment: string) => {
  return environment === "production"
    ? (import.meta as any).env.VITE_BACKEND_URL
    : "http://localhost:5173";
};

export const getUiURL = () => {
  return process.env.NODE_ENV === "production" ? "https://example.com" : "http://localhost:3000";
};

export const constructURL = (...path: string[]) => {
  return path.join("/");
};
