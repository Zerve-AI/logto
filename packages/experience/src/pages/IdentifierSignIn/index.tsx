import { AgreeToTermsPolicy, experience } from '@logto/schemas';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import LandingPageLayout from '@/Layout/LandingPageLayout';
import SingleSignOnFormModeContextProvider from '@/Providers/SingleSignOnFormModeContextProvider';
import IdentifierSignInForm from '@/components/IdentifierSignInForm';
import PasswordSignInForm from '@/components/PasswordSignInForm';
import TextLink from '@/components/TextLink';
import TermsAndPrivacyLinks from '@/containers/TermsAndPrivacyLinks';
import useTerms from '@/hooks/use-terms';
import { identifierInputDescriptionMap } from '@/utils/form';

import styles from './index.module.scss';
import useIdentifierSignInMethods from './use-identifier-sign-in-methods';

const footerTermsDisplayPolicies = new Set([
  AgreeToTermsPolicy.Automatic,
  AgreeToTermsPolicy.ManualRegistrationOnly,
]);

/**
 * Identifier sign-in page
 *
 * This page is used to display specific identifier-based sign-in methods to users.
 *
 * This page can be used as the first screen of the authentication flow,
 * and can be configured by setting the `first_screen` parameter to `identifier:sign_in`
 * in the authentication URL.
 *
 * identifiers used in this page can be configured by setting the `identifier` parameter
 * in the authentication URL, multiple identifiers can be separated by space.
 */
const IdentifierSignIn = () => {
  const { t } = useTranslation();
  const { agreeToTermsPolicy } = useTerms();

  const { signInMethods, isPasswordOnly } = useIdentifierSignInMethods();
  const shouldDisplayFooterTerms = Boolean(
    agreeToTermsPolicy && footerTermsDisplayPolicies.has(agreeToTermsPolicy)
  );

  // Fallback to sign-in page if no sign-in methods are available
  if (signInMethods.length === 0) {
    return <Navigate to={`/${experience.routes.signIn}`} />;
  }

  return (
    <LandingPageLayout
      title="description.sign_in_to_your_account"
      subTitle={t('description.identifier_sign_in_description', {
        types: signInMethods.map(({ identifier }) => t(identifierInputDescriptionMap[identifier])),
      })}
    >
      <SingleSignOnFormModeContextProvider>
        {isPasswordOnly ? (
          <PasswordSignInForm signInMethods={signInMethods.map(({ identifier }) => identifier)} />
        ) : (
          <IdentifierSignInForm signInMethods={signInMethods} />
        )}
      </SingleSignOnFormModeContextProvider>
      {shouldDisplayFooterTerms && <TermsAndPrivacyLinks className={styles.terms} />}
      <TextLink
        className={styles.optionsLink}
        to={`/${experience.routes.signIn}`}
        text="description.all_sign_in_options"
      />
    </LandingPageLayout>
  );
};

export default IdentifierSignIn;
