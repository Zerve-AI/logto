import { CaptchaType, RecaptchaEnterpriseMode } from '@logto/schemas';
import classNames from 'classnames';
import { useContext } from 'react';

import CaptchaContext from '@/Providers/CaptchaContextProvider/CaptchaContext';

import styles from './index.module.scss';

type Props = {
  readonly className?: string;
};

const CaptchaBox = ({ className }: Props) => {
  const { captchaConfig, widgetRef, isCaptchaRequired } = useContext(CaptchaContext);

  // Check if widget rendering is needed
  // Turnstile always needs a widget, reCAPTCHA Enterprise needs it only in checkbox mode
  const needsWidget =
    isCaptchaRequired &&
    captchaConfig &&
    (captchaConfig.type === CaptchaType.Turnstile ||
      captchaConfig.mode === RecaptchaEnterpriseMode.Checkbox);

  if (!needsWidget) {
    return null;
  }

  return <div ref={widgetRef} className={classNames(styles.captchaBox, className)} />;
};

export default CaptchaBox;
