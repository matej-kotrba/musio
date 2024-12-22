export const getServerURL = () => {
  return process.env.NODE_ENV === "production"
    ? "https://example.com"
    : "http://localhost:5173";
};

export const getUiURL = () => {
  return process.env.NODE_ENV === "production"
    ? "https://example.com"
    : "http://localhost:3000";
};

export const construstURL = (...path: string[]) => {
  return path.join("/");
};
