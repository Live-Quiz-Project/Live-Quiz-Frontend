/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_BACKEND_URL: string;
  VITE_WEBSOCKET_URL: string;
  VITE_BASE_URL: string;
  VITE_MANAGEMENT_URL: string;
  VITE_FIREBASE_STORAGE_BASE_URL: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
