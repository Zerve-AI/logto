import SecondaryPageLayout from '@/Layout/SecondaryPageLayout';
import SwitchMfaFactorsLink from '@/components/SwitchMfaFactorsLink';
import TotpCodeVerification from '@/containers/TotpCodeVerification';
import useMfaFlowState from '@/hooks/use-mfa-factors-state';
import ErrorPage from '@/pages/ErrorPage';
import { UserMfaFlow } from '@/types';

import styles from './index.module.scss';

const TotpVerification = () => {
  const flowState = useMfaFlowState();

  if (!flowState) {
    return <ErrorPage title="error.invalid_session" />;
  }

  return (
    <SecondaryPageLayout
      isHeaderCentered
      title="mfa.enter_one_time_code"
      description="mfa.enter_one_time_code_description"
    >
      <div className={styles.content}>
        <TotpCodeVerification flow={UserMfaFlow.MfaVerification} />
        <SwitchMfaFactorsLink
          flow={UserMfaFlow.MfaVerification}
          flowState={flowState}
          className={styles.switchFactorLink}
        />
      </div>
    </SecondaryPageLayout>
  );
};

export default TotpVerification;
