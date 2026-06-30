import classNames from 'classnames';
import { useCallback } from 'react';

import Checkbox from '@/components/Checkbox';
import TermsLinks from '@/components/TermsLinks';
import useTerms from '@/hooks/use-terms';
import { onKeyDownHandler } from '@/shared/utils/a11y';

import styles from './index.module.scss';

type Props = {
  readonly className?: string;
};

const TermsAndPrivacyCheckbox = ({ className }: Props) => {
  const { termsAgreement, setTermsAgreement, termsOfUseUrl, privacyPolicyUrl, isTermsDisabled } =
    useTerms();

  // Const { t } = useTranslation();
  // Const prefix = t('description.agree_with_terms');
  const prefix = 'I agree to the ';

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
        <span>{prefix}</span>
        <TermsLinks inline termsOfUseUrl={termsOfUseUrl} privacyPolicyUrl={privacyPolicyUrl} />
      </div>
    </div>
  );
};

export default TermsAndPrivacyCheckbox;
