import { useTranslation } from 'react-i18next';

import SecondaryPageLayout from '@/Layout/SecondaryPageLayout';
import CheckMark from '@/assets/icons/check-mark.svg?react';

import styles from './Success.module.scss';

const Success = () => {
  const { t } = useTranslation();

  return (
    <SecondaryPageLayout
      isHeaderCentered
      isNavBarHidden
      title="description.device_activation_success"
      description={
        <div className={styles.successBody}>
          <div className={styles.iconWrapper}>
            <CheckMark className={styles.icon} />
          </div>
          {t('description.device_activation_success_description')}
        </div>
      }
    >
      {null}
    </SecondaryPageLayout>
  );
};

export default Success;
