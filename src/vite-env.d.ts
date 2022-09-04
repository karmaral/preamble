/* eslint-disable no-unused-vars */
/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UNSPLASH_API_ACCESS_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
