import { experience } from '@logto/schemas';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import SecondaryPageLayout from '@/Layout/SecondaryPageLayout';
import useConsumeOneTimeTokenParameters from '@/hooks/use-consume-one-time-token-parameters';
import useNavigateWithPreservedSearchParams from '@/hooks/use-navigate-with-preserved-search-params';
import usePrefilledIdentifier from '@/hooks/use-prefilled-identifier';
import ErrorPage from '@/pages/ErrorPage';
import { identifierInputDescriptionMap } from '@/utils/form';

import ForgotPasswordForm from '../ForgotPassword/ForgotPasswordForm';

import OneTimeTokenForm from './OneTimeTokenForm';
import type { ResetPasswordMagicLinkError } from './types';
import { useResetPasswordMethods } from './use-reset-password-methods';

/**
 * ResetPasswordLanding Component
 *
 * This is a specialized "first screen" page dedicated to the password reset process,
 * distinct from the password reset step in the regular login flow.
 * As the entry point for the password reset flow, it allows users to initiate
 * the password reset process directly.
 *
 * Developers can specify this page as the initial screen of the user's login flow
 * by setting the `first_screen=reset_password` parameter in the authentication flow.
 *
 * Typical use cases include:
 * 1. When system administrators create accounts for new users and require them
 *    to update their password upon first login.
 * 2. When users initiate an authentication flow with reset password as the first screen
 *    by clicking a link in a password reset email.
 *
 * This approach ensures that users can seamlessly enter the password reset flow
 * in specific scenarios, enhancing both user experience and account security.
 */
const ResetPasswordLanding = () => {
  const { t } = useTranslation();
  const navigate = useNavigateWithPreservedSearchParams();
  const { oneTimeToken, loginHint } = useConsumeOneTimeTokenParameters();
  const [magicLinkError, setMagicLinkError] = useState<ResetPasswordMagicLinkError>();
  const enabledMethods = useResetPasswordMethods();
  const { value: prefilledValue } = usePrefilledIdentifier({
    enabledIdentifiers: enabledMethods,
    isForgotPassword: true,
  });

  if (magicLinkError) {
    return (
      <ErrorPage
        isNavbarHidden
        title="error.invalid_link"
        message={magicLinkError.message ?? 'error.invalid_link_description'}
        rawMessage={magicLinkError.rawMessage}
      />
    );
  }

  // Fallback to sign-in page when self-service reset is unavailable and this is not a magic link.
  if (!oneTimeToken && enabledMethods.length === 0) {
    return <Navigate to={`/${experience.routes.signIn}`} />;
  }

  return (
    <SecondaryPageLayout
      isHeaderCentered
      title="description.reset_password"
      description={
        oneTimeToken
          ? 'description.reset_password_magic_link_description'
          : 'description.reset_password_description'
      }
      descriptionProps={
        oneTimeToken
          ? undefined
          : {
              types: enabledMethods.map((method) => t(identifierInputDescriptionMap[method])),
            }
      }
      onBack={() => {
        navigate(`/${experience.routes.signIn}`);
      }}
    >
      {oneTimeToken ? (
        <OneTimeTokenForm token={oneTimeToken} loginHint={loginHint} onError={setMagicLinkError} />
      ) : (
        <ForgotPasswordForm autoFocus defaultValue={prefilledValue} enabledTypes={enabledMethods} />
      )}
    </SecondaryPageLayout>
  );
};

export default ResetPasswordLanding;
