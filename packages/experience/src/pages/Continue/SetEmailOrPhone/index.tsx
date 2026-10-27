import type { MissingProfile } from '@logto/schemas';
import { SignInIdentifier } from '@logto/schemas';
import type { TFuncKey } from 'i18next';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import SecondaryPageLayout from '@/Layout/SecondaryPageLayout';
import UserInteractionContext from '@/Providers/UserInteractionContextProvider/UserInteractionContext';
import SubmitArrowButtonIcon from '@/components/Button/SubmitArrowButtonIcon';
import useSendVerificationCode from '@/hooks/use-send-verification-code';
import type { ContinueFlowInteractionEvent, VerificationCodeIdentifier } from '@/types';
import { UserFlow } from '@/types';

import IdentifierProfileForm from '../IdentifierProfileForm';

import SocialIdentityNotification from './SocialIdentityNotification';

export type VerificationCodeProfileType = Exclude<
  MissingProfile,
  'username' | 'password' | 'extraProfile'
>;

type Props = {
  readonly missingProfile: VerificationCodeProfileType;
  readonly interactionEvent: ContinueFlowInteractionEvent;
};

export const pageContent: Record<
  VerificationCodeProfileType,
  {
    title: TFuncKey;
    description: TFuncKey;
  }
> = {
  email: {
    title: 'description.link_email',
    description: 'description.link_email_description',
  },
  phone: {
    title: 'description.link_phone',
    description: 'description.link_phone_description',
  },
  emailOrPhone: {
    title: 'description.link_email_or_phone',
    description: 'description.link_email_or_phone_description',
  },
};

const formSettings: Record<
  VerificationCodeProfileType,
  { defaultType: VerificationCodeIdentifier; enabledTypes: VerificationCodeIdentifier[] }
> = {
  email: {
    defaultType: SignInIdentifier.Email,
    enabledTypes: [SignInIdentifier.Email],
  },
  phone: {
    defaultType: SignInIdentifier.Phone,
    enabledTypes: [SignInIdentifier.Phone],
  },
  emailOrPhone: {
    defaultType: SignInIdentifier.Email,
    enabledTypes: [SignInIdentifier.Email, SignInIdentifier.Phone],
  },
};

const SetEmailOrPhone = ({ missingProfile, interactionEvent }: Props) => {
  const { t } = useTranslation();
  const { onSubmit, errorMessage, clearErrorMessage } = useSendVerificationCode(UserFlow.Continue);
  const { setIdentifierInputValue } = useContext(UserInteractionContext);

  const handleSubmit = async (identifier: SignInIdentifier, value: string) => {
    // Only handles email and phone
    if (identifier === SignInIdentifier.Username) {
      return;
    }

    setIdentifierInputValue({ type: identifier, value });

    return onSubmit({ identifier, value }, interactionEvent);
  };

  return (
    <SecondaryPageLayout isHeaderCentered {...pageContent[missingProfile]}>
      <IdentifierProfileForm
        autoFocus
        submitIcon={<SubmitArrowButtonIcon />}
        {...(missingProfile === 'email'
          ? {
              appearance: 'plain' as const,
              label: t('input.email'),
              placeholder: t('input.enter_email'),
            }
          : {})}
        {...(missingProfile === 'phone'
          ? { appearance: 'plain' as const, label: t('input.phone_number') }
          : {})}
        errorMessage={errorMessage}
        clearErrorMessage={clearErrorMessage}
        {...formSettings[missingProfile]}
        onSubmit={handleSubmit}
      />
      <SocialIdentityNotification missingProfileTypes={formSettings[missingProfile].enabledTypes} />
    </SecondaryPageLayout>
  );
};

export default SetEmailOrPhone;
