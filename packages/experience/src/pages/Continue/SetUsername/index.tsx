import { SignInIdentifier } from '@logto/schemas';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import SecondaryPageLayout from '@/Layout/SecondaryPageLayout';
import UserInteractionContext from '@/Providers/UserInteractionContextProvider/UserInteractionContext';
import SubmitArrowButtonIcon from '@/components/Button/SubmitArrowButtonIcon';
import { useUsernamePolicyDescription } from '@/hooks/use-sie';
import { type ContinueFlowInteractionEvent } from '@/types';

import IdentifierProfileForm from '../IdentifierProfileForm';

import useSetUsername from './use-set-username';

type Props = {
  readonly interactionEvent: ContinueFlowInteractionEvent;
};

const SetUsername = ({ interactionEvent }: Props) => {
  const { t } = useTranslation();
  const { onSubmit, errorMessage, clearErrorMessage } = useSetUsername(interactionEvent);
  const usernamePolicyDescription = useUsernamePolicyDescription();

  const { setIdentifierInputValue } = useContext(UserInteractionContext);

  const handleSubmit = async (identifier: SignInIdentifier, value: string) => {
    if (identifier !== SignInIdentifier.Username) {
      return;
    }

    setIdentifierInputValue({ type: identifier, value });

    return onSubmit(value);
  };

  return (
    <SecondaryPageLayout
      isHeaderCentered
      title="description.enter_username"
      description={
        usernamePolicyDescription
          ? 'description.enter_username_policy_description'
          : 'description.enter_username_description'
      }
      descriptionProps={{ requirements: usernamePolicyDescription }}
    >
      <IdentifierProfileForm
        autoFocus
        appearance="plain"
        label={t('input.username')}
        placeholder={t('input.username')}
        submitIcon={<SubmitArrowButtonIcon />}
        errorMessage={errorMessage}
        clearErrorMessage={clearErrorMessage}
        defaultType={SignInIdentifier.Username}
        enabledTypes={[SignInIdentifier.Username]}
        onSubmit={handleSubmit}
      />
    </SecondaryPageLayout>
  );
};

export default SetUsername;
