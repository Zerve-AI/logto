import { Theme } from '@logto/schemas';
import { useContext, useMemo, type ReactNode } from 'react';

import PageContext from '@/Providers/PageContextProvider/PageContext';

type Props = {
  readonly children: ReactNode;
};

/**
 * Sign-in and sign-up paint a dark shell even when the page theme is light.
 * Descendants that choose assets from `PageContext.theme` should follow that shell.
 * The stored theme is left unchanged so other routes keep the normal theme.
 */
const AuthRouteTheme = ({ children }: Props) => {
  const pageContext = useContext(PageContext);
  const value = useMemo(() => ({ ...pageContext, theme: Theme.Dark }), [pageContext]);

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};

export default AuthRouteTheme;
