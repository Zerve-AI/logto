import { experience, type ConsentInfoResponse } from '@logto/schemas';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import SecondaryPageLayout from '@/Layout/SecondaryPageLayout';
import { getConsentInfo } from '@/apis/consent';
import SubmitArrowButtonIcon from '@/components/Button/SubmitArrowButtonIcon';
import TextLink from '@/components/TextLink';
import useApi from '@/hooks/use-api';
import useErrorHandler from '@/hooks/use-error-handler';
import useNavigateWithPreservedSearchParams from '@/hooks/use-navigate-with-preserved-search-params';
import UserProfile from '@/pages/Consent/UserProfile';
import { getRedirectUriOrigin } from '@/pages/Consent/util';
import ErrorPage from '@/pages/ErrorPage';
import Button from '@/shared/components/Button';
import LoadingLayer from '@/shared/components/LoadingLayer';

import styles from './index.module.scss';

/**
 * This component is only used when there's an active session, and then the user
 * is trying to sign-in with another account (e.g., using a magic link).
 */
const SwitchAccount = () => {
  const navigate = useNavigateWithPreservedSearchParams();
  const handleError = useErrorHandler();

  const [consentData, setConsentData] = useState<ConsentInfoResponse>();
  const asyncGetConsentInfo = useApi(getConsentInfo);

  const [params] = useSearchParams();
  const loginHint = params.get('login_hint');

  useEffect(() => {
    (async () => {
      const [error, result] = await asyncGetConsentInfo();

      if (error) {
        await handleError(error);
        return;
      }
      setConsentData(result);
    })();
  }, [asyncGetConsentInfo, handleError]);

  if (!loginHint) {
    return <ErrorPage title="error.unknown" message="error.unknown" />;
  }

  if (!consentData) {
    return <LoadingLayer />;
  }

  const redirectUriOrigin = consentData.redirectUri
    ? getRedirectUriOrigin(consentData.redirectUri)
    : undefined;

  return (
    <SecondaryPageLayout
      isHeaderCentered
      isNavBarHidden
      title="description.switch_account_title"
      titleProps={{ account: consentData.user.primaryEmail }}
      description="description.switch_account_description"
    >
      <div className={styles.content}>
        <UserProfile user={consentData.user} className={styles.userProfile} />
        <Button
          title="action.continue_as"
          i18nProps={{ name: loginHint }}
          icon={<SubmitArrowButtonIcon />}
          iconPlacement="edge"
          onClick={() => {
            navigate(
              { pathname: `/${experience.routes.oneTimeToken}`, search: `?${params.toString()}` },
              { replace: true }
            );
          }}
        />
        <TextLink
          className={styles.linkButton}
          text="action.back_to_current_account"
          onClick={() => {
            if (redirectUriOrigin) {
              window.location.assign(redirectUriOrigin);
            }
          }}
        />
      </div>
    </SecondaryPageLayout>
  );
};

export default SwitchAccount;
