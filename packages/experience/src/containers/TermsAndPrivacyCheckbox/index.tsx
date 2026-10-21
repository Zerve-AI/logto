import classNames from 'classnames';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Checkbox from '@/components/Checkbox';
import TextLink from '@/components/TextLink';
import useTerms from '@/hooks/use-terms';
import { onKeyDownHandler } from '@/shared/utils/a11y';

import styles from './index.module.scss';

type Props = {
  readonly className?: string;
};

const TermsAndPrivacyCheckbox = ({ className }: Props) => {
  const { t } = useTranslation();
  const { termsAgreement, setTermsAgreement, termsOfUseUrl, privacyPolicyUrl, isTermsDisabled } =
    useTerms();

  const toggle = useCallback(() => {
    setTermsAgreement((termsAgreement) => !termsAgreement);
  }, [setTermsAgreement]);

  if (isTermsDisabled) {
    return null;
  }

  return (
    <div
      role="radio"
      aria-checked={termsAgreement}
      tabIndex={0}
      className={classNames(styles.terms, className)}
      onClick={toggle}
      onKeyDown={onKeyDownHandler({
        Escape: () => {
          setTermsAgreement(false);
        },
        Enter: toggle,
        ' ': toggle,
      })}
    >
      <Checkbox
        name="termsAgreement"
        checked={termsAgreement}
        className={styles.checkbox}
        size="small"
      />
      <div className={styles.content}>
        <span>{t('description.agree_to_terms_prefix')}</span>
        {termsOfUseUrl && (
          <TextLink
            className={styles.link}
            href={termsOfUseUrl}
            text="description.terms_and_conditions"
            type="secondary"
            target="_blank"
            onClick={(event) => {
              event.stopPropagation();
            }}
          />
        )}
        {termsOfUseUrl && privacyPolicyUrl && ` ${t('description.and')} `}
        {privacyPolicyUrl && (
          <TextLink
            className={styles.link}
            href={privacyPolicyUrl}
            text="description.privacy_policy"
            type="secondary"
            target="_blank"
            onClick={(event) => {
              event.stopPropagation();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TermsAndPrivacyCheckbox;
