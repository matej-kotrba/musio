declare namespace NodeJS {
  export interface ProcessEnv {
    ENV: string;
    PORT: string;
    UI_URL: string;
  }
}

interface ImportMetEnv {
  VITE_BACKEND_URL: string;
  VITE_ENVIRONMENT: string;
}

interface ImportMeta {
  readonly env: ImportMetEnv;
}
