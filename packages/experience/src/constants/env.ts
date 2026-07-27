import { yes } from '@silverhand/essentials';

export const isDevFeaturesEnabled =
  process.env.NODE_ENV !== 'production' || yes(process.env.DEV_FEATURES_ENABLED);

/**
 * Endpoint of the Zerve user service
 */
export const userServiceEndpoint =
  process.env.USER_SERVICE_ENDPOINT ??
  (process.env.NODE_ENV === 'production' ? 'https://user.api.zerve.ai' : 'http://localhost:3000');
