import { createDirectus, rest, serverPing } from '@directus/sdk';

type Schema = Record<string, never>;

const directusUrl = import.meta.env.VITE_DIRECTUS_URL;

if (!directusUrl) {
  throw new Error('VITE_DIRECTUS_URL is not configured.');
}

export const directus = createDirectus<Schema>(directusUrl).with(rest());

export const pingDirectus = (): Promise<string> => directus.request(serverPing());