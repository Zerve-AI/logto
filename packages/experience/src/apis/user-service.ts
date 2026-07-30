/**
 * APIs of the Zerve user service. Unlike the other modules in this directory, these endpoints are
 * not served by Logto core, so they are called with a plain `ky` instance instead of the shared
 * `api` client (which attaches Logto interaction headers).
 */

import ky, { HTTPError } from 'ky';

import { userServiceEndpoint } from '@/constants/env';

/** Requests are gating a user action, so give up quickly and let the sign-up proceed. */
const requestTimeout = 5000;

/**
 * Check the email quality against the user service before signing up.
 *
 * The service answers `200` when sign-up should proceed and `400` when it should not. It already
 * fails open on its side when the underlying validation provider is unavailable, so every other
 * outcome here — network error, timeout, or an unexpected status — must not block sign-up either.
 */
export const isEmailAllowedForSignUp = async (email: string) => {
  try {
    await ky.get(new URL('/users/validate_email', userServiceEndpoint).href, {
      searchParams: { email },
      timeout: requestTimeout,
      retry: 0,
    });

    return true;
  } catch (error: unknown) {
    if (error instanceof HTTPError && error.response.status === 400) {
      return false;
    }

    return true;
  }
};
