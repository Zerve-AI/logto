import { createContext } from 'react';

import { type SignInExperienceResponse } from '@/types';

export type CaptchaContextType = {
  isCaptchaRequired: boolean;
  captchaConfig: SignInExperienceResponse['captchaConfig'];
  /**
   * Execute the captcha and resolve with a verification token.
   *
   * @param identifier The identifier (e.g. email) the user is authenticating with. Used by the
   * pre-flight check to skip the captcha for the synthetic automation user.
   */
  executeCaptcha: (identifier?: string) => Promise<string | undefined>;
  // Some captcha providers need to render a widget (checkbox, etc.) to the page
  // and this is the ref to the widget
  widgetRef: React.RefObject<HTMLDivElement> | undefined;
};

export default createContext<CaptchaContextType>({
  isCaptchaRequired: false,
  captchaConfig: undefined,
  widgetRef: undefined,
  executeCaptcha: async () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  },
});
