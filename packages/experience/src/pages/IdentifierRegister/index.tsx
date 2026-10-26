import { AgreeToTermsPolicy, experience, SignInMode } from '@logto/schemas';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import LandingPageLayout from '@/Layout/LandingPageLayout';
import SingleSignOnFormModeContextProvider from '@/Providers/SingleSignOnFormModeContextProvider';
import IdentifierRegisterForm from '@/components/IdentifierRegisterForm';
import TextLink from '@/components/TextLink';
import TermsAndPrivacyLinks from '@/containers/TermsAndPrivacyLinks';
import { useSieMethods } from '@/hooks/use-sie';
import useTerms from '@/hooks/use-terms';
import { identifierInputDescriptionMap } from '@/utils/form';

import styles from './index.module.scss';
import useIdentifierSignUpMethods from './use-identifier-sign-up-methods';

/**
 * Identifier register page
 *
 * This page is used to display specific identifier-based registration methods to users.
 *
 * This page can be used as the first screen of the authentication flow,
 * and can be configured by setting the `first_screen` parameter to `identifier:register`
 * in the authentication URL.
 */
const IdentifierRegister = () => {
  const { t } = useTranslation();
  const signUpMethods = useIdentifierSignUpMethods();
  const { signInMode } = useSieMethods();
  const { agreeToTermsPolicy } = useTerms();

  /**
   * Fallback to sign-in page in the following cases:
   * - Sign-in mode is set to `SignIn` (user registration is not enabled in the sign-in experience configuration)
   * - No sign up methods are available
   */
  if (signInMode === SignInMode.SignIn || signUpMethods.length === 0) {
    return <Navigate to={`/${experience.routes.signIn}`} />;
  }

  return (
    <LandingPageLayout
      title="description.create_an_account"
      subTitle={t('description.identifier_register_description', {
        types: signUpMethods.map((identifier) => t(identifierInputDescriptionMap[identifier])),
      })}
    >
      <SingleSignOnFormModeContextProvider>
        <IdentifierRegisterForm signUpMethods={signUpMethods} />
      </SingleSignOnFormModeContextProvider>
      {agreeToTermsPolicy === AgreeToTermsPolicy.Automatic && (
        <TermsAndPrivacyLinks className={styles.terms} />
      )}
      <TextLink
        className={styles.optionsLink}
        to={`/${experience.routes.register}`}
        text="description.all_account_creation_options"
      />
    </LandingPageLayout>
  );
};

export default IdentifierRegister;
