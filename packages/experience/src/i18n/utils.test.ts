import { mergePhraseValue } from './utils';

describe('mergePhraseValue', () => {
  it('keeps built-in keys that the remote phrases do not include', () => {
    expect(
      mergePhraseValue(
        {
          translation: {
            description: { create_an_account: 'Create an account', sign_in: 'Sign in' },
          },
        },
        { translation: { description: { sign_in: 'Anmelden' } } }
      )
    ).toEqual({
      translation: { description: { create_an_account: 'Create an account', sign_in: 'Anmelden' } },
    });
  });
});
