import { VerificationType } from '@logto/schemas';
import { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { validate } from 'superstruct';

import SecondaryPageLayout from '@/Layout/SecondaryPageLayout';
import UserInteractionContext from '@/Providers/UserInteractionContextProvider/UserInteractionContext';
import SubmitArrowButtonIcon from '@/components/Button/SubmitArrowButtonIcon';
import SwitchMfaFactorsLink from '@/components/SwitchMfaFactorsLink';
import useWebAuthnOperation from '@/hooks/use-webauthn-operation';
import ErrorPage from '@/pages/ErrorPage';
import Button from '@/shared/components/Button';
import { UserMfaFlow } from '@/types';
import { webAuthnStateGuard } from '@/types/guard';
import { isWebAuthnOptions } from '@/utils/webauthn';

import styles from './index.module.scss';

const WebAuthnVerification = () => {
  const { state } = useLocation();
  const [, webAuthnState] = validate(state, webAuthnStateGuard);
  const { verificationIdsMap } = useContext(UserInteractionContext);
  const verificationId = verificationIdsMap[VerificationType.WebAuthn];

  const handleWebAuthn = useWebAuthnOperation();
  const [isVerifying, setIsVerifying] = useState(false);

  if (!webAuthnState || !verificationId) {
    return <ErrorPage title="error.invalid_session" />;
  }

  const { options, availableFactors, skippable } = webAuthnState;

  if (!isWebAuthnOptions(options)) {
    return <ErrorPage title="error.invalid_session" />;
  }

  return (
    <SecondaryPageLayout
      isHeaderCentered
      title="mfa.verify_via_passkey"
      description="mfa.verify_via_passkey_description"
    >
      <div className={styles.content}>
        <Button
          title="action.verify_via_passkey"
          icon={<SubmitArrowButtonIcon />}
          iconPlacement="edge"
          isLoading={isVerifying}
          onClick={async () => {
            setIsVerifying(true);
            await handleWebAuthn(options, verificationId);
            setIsVerifying(false);
          }}
        />
        <SwitchMfaFactorsLink
          flow={UserMfaFlow.MfaVerification}
          flowState={{ availableFactors, skippable }}
          className={styles.switchLink}
        />
      </div>
    </SecondaryPageLayout>
  );
};

export default WebAuthnVerification;
