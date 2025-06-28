import '@cloudflare/workers-types';

declare global {
  interface ENV {
    DB: D1Database;
  }
}

export {}; 