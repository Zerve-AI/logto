import { yes } from '@silverhand/essentials';

export const isDevFeaturesEnabled =
  process.env.NODE_ENV !== 'production' || yes(process.env.DEV_FEATURES_ENABLED);

/**
 * Endpoint of the Zerve user service
 */
export const userServiceEndpoint =
  process.env.USER_SERVICE_ENDPOINT ??
  (process.env.NODE_ENV === 'production'
    ? window.origin.includes('zerve-dev')
      ? 'https://user.api.zerve-dev.io' // Dev build (app.zerve-dev.io)
      : 'https://user.api.zerve.ai' // Prod build (app.zerve.ai)
    : 'http://localhost:3000'); // Local development (localhost:8080)
