import { useContext } from 'react';

import PageContext from '@/Providers/PageContextProvider/PageContext';
import { getAuthShellLogoUrl } from '@/shared/utils/logo';

import styles from './index.module.scss';

const ZerveLogo = () => {
  const { experienceSettings } = useContext(PageContext);

  if (!experienceSettings) {
    return null;
  }

  const logoUrl = getAuthShellLogoUrl(experienceSettings.branding);

  if (!logoUrl) {
    return null;
  }

  return <img className={styles.logo} alt="app logo" src={logoUrl} />;
};

export default ZerveLogo;
