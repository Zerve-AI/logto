import type { SignUp } from '@logto/schemas';
import { SignInMode, SignInIdentifier } from '@logto/schemas';
import { Route, Routes } from 'react-router-dom';

import renderWithPageContext from '@/__mocks__/RenderWithPageContext';
import SettingsProvider from '@/__mocks__/RenderWithPageContext/SettingsProvider';
import { mockSignInExperienceSettings, mockSsoConnectors } from '@/__mocks__/logto';
import Register from '@/pages/Register';
import type { SignInExperienceResponse } from '@/types';

jest.mock('i18next', () => ({
  language: 'en',
  t: (key: string) => key,
}));

describe('<Register />', () => {
  const renderRegisterPage = (settings?: Partial<SignInExperienceResponse>) =>
    renderWithPageContext(
      <SettingsProvider settings={{ ...mockSignInExperienceSettings, ...settings }}>
        <Register />
      </SettingsProvider>
    );

  const signUpTestCases: SignUp[] = [
    [SignInIdentifier.Username],
    [SignInIdentifier.Email],
    [SignInIdentifier.Phone],
    [SignInIdentifier.Phone, SignInIdentifier.Email],
  ].map((identifiers) => ({
    identifiers,
    password: true,
    verify: true,
  }));

  test.each(signUpTestCases)('renders with %o sign up settings', async (...signUp) => {
    const { queryAllByText, container } = renderRegisterPage();

    expect(container.querySelector('input[name=identifier]')).not.toBeNull();

    // Social buttons plus the email submit button share this phrase.
    expect(queryAllByText('action.sign_in_with')).toHaveLength(
      mockSignInExperienceSettings.socialConnectors.length + 1
    );
  });

  test('renders with social as primary', async () => {
    const { queryByText, queryAllByText, container } = renderRegisterPage({
      signUp: { ...mockSignInExperienceSettings.signUp, identifiers: [] },
    });

    expect(queryAllByText('action.sign_in_with')).toHaveLength(
      mockSignInExperienceSettings.socialConnectors.length
    );

    expect(container.querySelector('input[name=identifier]')).toBeNull();
    expect(queryByText('action.create_account')).toBeNull();
  });

  test('render with sign-in only mode should should redirect to the SignIn page', () => {
    const { queryByText } = renderWithPageContext(
      <SettingsProvider
        settings={{ ...mockSignInExperienceSettings, signInMode: SignInMode.SignIn }}
      >
        <Routes>
          <Route path="sign-in" element={<div>sign-in</div>} />
          <Route path="register" element={<Register />} />
        </Routes>
      </SettingsProvider>,
      {
        initialEntries: ['/register'],
      }
    );
    expect(queryByText('sign-in')).not.toBeNull();
  });

  test('does not render a single sign on link on create account', () => {
    const { queryByText } = renderRegisterPage({
      ssoConnectors: mockSsoConnectors,
      singleSignOnEnabled: true,
    });

    expect(queryByText('action.single_sign_on')).toBeNull();
  });

  test('does not render a single sign on link when single sign on is enabled but the list is empty', () => {
    const { queryByText } = renderRegisterPage({
      ssoConnectors: [],
      singleSignOnEnabled: true,
    });

    expect(queryByText('action.single_sign_on')).toBeNull();
  });

  test('should not render single sign on link with single sign on disabled', () => {
    const { queryByText } = renderRegisterPage({
      ssoConnectors: mockSsoConnectors,
      singleSignOnEnabled: false,
    });

    expect(queryByText('action.single_sign_on')).toBeNull();
  });
});
