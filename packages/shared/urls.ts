export const getServerURL = (environment: string) => {
  return environment === "production"
    ? "https://0adc1a298d6a.ngrok-free.app"
    : "http://localhost:5173";
};

export const getUiURL = () => {
  return process.env.NODE_ENV === "production" ? "https://example.com" : "http://localhost:3000";
};

export const constructURL = (...path: string[]) => {
  return path.join("/");
};
