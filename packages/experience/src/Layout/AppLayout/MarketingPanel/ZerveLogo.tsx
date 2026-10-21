import { Theme } from '@logto/schemas';
import { useContext } from 'react';

import PageContext from '@/Providers/PageContextProvider/PageContext';
import { getBrandingLogoUrl } from '@/shared/utils/logo';

import styles from './index.module.scss';

const ZerveLogo = () => {
  const { experienceSettings } = useContext(PageContext);

  if (!experienceSettings) {
    return null;
  }

  // The auth shell is always dark, so use the dark-background logo.
  const logoUrl = getBrandingLogoUrl({
    theme: Theme.Dark,
    branding: experienceSettings.branding,
    isDarkModeEnabled: true,
  });

  if (!logoUrl) {
    return null;
  }

  return <img className={styles.logo} alt="app logo" src={logoUrl} />;
};

export default ZerveLogo;
