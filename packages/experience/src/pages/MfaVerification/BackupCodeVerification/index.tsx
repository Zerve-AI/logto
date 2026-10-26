import { MfaFactor } from '@logto/schemas';
import { t } from 'i18next';
import { useCallback, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';

import SecondaryPageLayout from '@/Layout/SecondaryPageLayout';
import SubmitArrowButtonIcon from '@/components/Button/SubmitArrowButtonIcon';
import { InputField } from '@/components/InputFields';
import SwitchMfaFactorsLink from '@/components/SwitchMfaFactorsLink';
import useMfaFlowState from '@/hooks/use-mfa-factors-state';
import useSendMfaPayload from '@/hooks/use-send-mfa-payload';
import ErrorPage from '@/pages/ErrorPage';
import Button from '@/shared/components/Button';
import { UserMfaFlow } from '@/types';

import styles from './index.module.scss';

type FormState = {
  code: string;
};

const BackupCodeVerification = () => {
  const flowState = useMfaFlowState();
  const sendMfaPayload = useSendMfaPayload();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormState>({ defaultValues: { code: '' } });

  const onSubmitHandler = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      await handleSubmit(async ({ code }) => {
        await sendMfaPayload({
          flow: UserMfaFlow.MfaVerification,
          payload: { type: MfaFactor.BackupCode, code },
        });
      })(event);
    },
    [handleSubmit, sendMfaPayload]
  );

  if (!flowState) {
    return <ErrorPage title="error.invalid_session" />;
  }

  return (
    <SecondaryPageLayout
      isHeaderCentered
      title="mfa.enter_a_backup_code"
      description="mfa.enter_backup_code_description"
    >
      <div className={styles.content}>
        <form onSubmit={onSubmitHandler}>
          <InputField
            appearance="plain"
            autoComplete="off"
            label={t('input.backup_code')}
            placeholder={t('input.backup_code')}
            {...register('code')}
          />
          <Button
            className={styles.submit}
            title="action.continue"
            htmlType="submit"
            icon={<SubmitArrowButtonIcon />}
            iconPlacement="edge"
            isLoading={isSubmitting}
          />
        </form>
        <SwitchMfaFactorsLink
          flow={UserMfaFlow.MfaVerification}
          flowState={flowState}
          className={styles.switchFactorLink}
        />
      </div>
    </SecondaryPageLayout>
  );
};

export default BackupCodeVerification;
