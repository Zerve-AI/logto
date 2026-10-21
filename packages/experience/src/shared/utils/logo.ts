import type { Branding } from '@logto/schemas';
import { Theme } from '@logto/schemas';
import type { Nullable } from '@silverhand/essentials';

export type GetLogoUrl = {
  theme: Theme;
  logoUrl: string;
  darkLogoUrl?: Nullable<string>;
};

export const getLogoUrl = ({ theme, logoUrl, darkLogoUrl }: GetLogoUrl) => {
  if (theme === Theme.Dark) {
    return darkLogoUrl ?? logoUrl;
  }

  return logoUrl;
};

export type GetBrandingLogoUrl = {
  theme: Theme;
  branding: Branding;
  isDarkModeEnabled: boolean;
};

export const getBrandingLogoUrl = ({ theme, branding, isDarkModeEnabled }: GetBrandingLogoUrl) => {
  const { logoUrl, darkLogoUrl } = branding;

  if (!isDarkModeEnabled) {
    return logoUrl;
  }

  if (!logoUrl && !darkLogoUrl) {
    return null;
  }

  if (logoUrl && darkLogoUrl) {
    return getLogoUrl({ theme, logoUrl, darkLogoUrl });
  }

  return logoUrl ?? darkLogoUrl;
};

/** OSS seed values in `createDefaultSignInExperience`. Not a tenant's own logo. */
const builtInLogtoLogoUrls = new Set([
  'https://logto.io/logo.svg',
  'https://logto.io/logo-dark.svg',
]);

const omitBuiltInLogtoLogo = (url?: Nullable<string>): string | undefined =>
  url && !builtInLogtoLogoUrls.has(url) ? url : undefined;

/**
 * Logo for the sign-in and sign-up shell. The shell is always dark, but a tenant
 * often replaces only `logoUrl` and leaves the seeded Logto `darkLogoUrl` in place.
 * Those built-in URLs are ignored so the configured logo is used. When neither URL
 * is custom, the original branding is used so the seeded logo still renders.
 */
export const getAuthShellLogoUrl = (branding: Branding) =>
  getBrandingLogoUrl({
    theme: Theme.Dark,
    isDarkModeEnabled: true,
    branding: {
      ...branding,
      logoUrl: omitBuiltInLogtoLogo(branding.logoUrl),
      darkLogoUrl: omitBuiltInLogtoLogo(branding.darkLogoUrl),
    },
  }) ??
  getBrandingLogoUrl({
    theme: Theme.Dark,
    isDarkModeEnabled: true,
    branding,
  });
