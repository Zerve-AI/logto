import renderWithPageContext from '@/__mocks__/RenderWithPageContext';
import SettingsProvider from '@/__mocks__/RenderWithPageContext/SettingsProvider';

import TermsAndPrivacy from '.';

describe('TermsAndPrivacy Container', () => {
  it('render with empty TermsAndPrivacy settings', () => {
    const { queryByText } = renderWithPageContext(<TermsAndPrivacy />);
    expect(queryByText('description.agree_to_terms_prefix')).toBeNull();
  });

  it('render with settings', async () => {
    const { queryByRole } = renderWithPageContext(
      <SettingsProvider>
        <TermsAndPrivacy />
      </SettingsProvider>
    );

    expect(queryByRole('link', { name: 'description.terms_and_conditions' })).not.toBeNull();
    expect(queryByRole('link', { name: 'description.privacy_policy' })).not.toBeNull();
  });
});
