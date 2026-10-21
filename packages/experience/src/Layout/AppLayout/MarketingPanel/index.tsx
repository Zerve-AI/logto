import { useTranslation } from 'react-i18next';

import TextLink from '@/components/TextLink';

import ZerveLogo from './ZerveLogo';
import styles from './index.module.scss';

export type AuthMarketingVariant = 'sign-in' | 'sign-up';

type Props = {
  readonly variant: AuthMarketingVariant;
  readonly termsOfUseUrl?: string;
  readonly privacyPolicyUrl?: string;
};

const websiteUrl = 'https://zerve.ai';

const MarketingPanel = ({ variant, termsOfUseUrl, privacyPolicyUrl }: Props) => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const headline =
    variant === 'sign-in'
      ? t('description.marketing_sign_in_headline')
      : t('description.marketing_sign_up_headline');
  const body =
    variant === 'sign-in'
      ? t('description.marketing_sign_in_body')
      : t('description.marketing_sign_up_body');

  return (
    <aside className={styles.panel}>
      <ZerveLogo />
      <div className={styles.middle}>
        <div>
          {(privacyPolicyUrl ?? termsOfUseUrl) && (
            <div className={styles.legalRow}>
              {privacyPolicyUrl && (
                <TextLink
                  href={privacyPolicyUrl}
                  target="_blank"
                  text="description.privacy_policy"
                  type="secondary"
                />
              )}
              {termsOfUseUrl && (
                <TextLink
                  href={termsOfUseUrl}
                  target="_blank"
                  text="description.terms_of_service"
                  type="secondary"
                />
              )}
            </div>
          )}
          <h1 className={styles.headline}>{headline}</h1>
          <p className={styles.body}>{body}</p>
        </div>
      </div>
      <div className={styles.bottom}>
        <a className={styles.backLink} href={websiteUrl} rel="noopener noreferrer">
          {t('description.back_to_website')}
        </a>
        <p className={styles.copyright}>{t('description.copyright', { year })}</p>
      </div>
    </aside>
  );
};

export default MarketingPanel;
