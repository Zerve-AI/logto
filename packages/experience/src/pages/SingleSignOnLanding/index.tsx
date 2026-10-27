import { AgreeToTermsPolicy, experience } from '@logto/schemas';
import { Navigate } from 'react-router-dom';

import SecondaryPageLayout from '@/Layout/SecondaryPageLayout';
import SingleSignOnForm from '@/components/SingleSignOnForm';
import TextLink from '@/components/TextLink';
import TermsAndPrivacyLinks from '@/containers/TermsAndPrivacyLinks';
import useNavigateWithPreservedSearchParams from '@/hooks/use-navigate-with-preserved-search-params';
import { useSieMethods } from '@/hooks/use-sie';
import useTerms from '@/hooks/use-terms';

import styles from './index.module.scss';

const SingleSignOnLanding = () => {
  const { singleSignOnEnabled } = useSieMethods();
  const { agreeToTermsPolicy } = useTerms();
  const navigate = useNavigateWithPreservedSearchParams();

  // Fallback to sign-in page if SSO is not enabled
  if (!singleSignOnEnabled) {
    return <Navigate to={`/${experience.routes.signIn}`} />;
  }

  return (
    <SecondaryPageLayout
      isHeaderCentered
      title="action.single_sign_on"
      onBack={() => {
        navigate(`/${experience.routes.signIn}`);
      }}
    >
      <SingleSignOnForm
        /* Should display terms and privacy checkbox when we need to confirm the terms and privacy policy for both sign-in and sign-up */
        isTermsAndPrivacyCheckboxVisible={agreeToTermsPolicy === AgreeToTermsPolicy.Manual}
      />
      {agreeToTermsPolicy === AgreeToTermsPolicy.Automatic && (
        <TermsAndPrivacyLinks className={styles.terms} />
      )}
      <TextLink
        className={styles.optionsLink}
        to={`/${experience.routes.signIn}`}
        text="description.all_sign_in_options"
      />
    </SecondaryPageLayout>
  );
};

export default SingleSignOnLanding;
