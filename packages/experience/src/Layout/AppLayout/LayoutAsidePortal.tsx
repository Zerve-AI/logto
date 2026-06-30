import { noop, type Nullable } from '@silverhand/essentials';
import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type LayoutAsidePortalContextType = {
  /** The DOM node of the footer portal slot, or `null` until it is mounted. */
  container: Nullable<HTMLElement>;
  /**
   * Registers an active portal. {@link AppLayout} only renders the slot while
   * at least one portal is registered. Returns an unregister function.
   */
  register: () => () => void;
};

export const LayoutAsidePortalContext = createContext<LayoutAsidePortalContextType>({
  container: null,
  register: () => noop,
});

type Props = {
  readonly children: ReactNode;
};

/**
 * Renders its children into the footer portal slot of {@link AppLayout}.
 *
 * Use this from pages rendered inside the layout's `<Outlet />` (e.g. the
 * Register page) to place content at the layout level instead of inside the
 * page's own subtree. The layout slot is only rendered while content is
 * present, so it never leaves an empty container behind.
 */
const LayoutAsidePortal = ({ children }: Props) => {
  const { container, register } = useContext(LayoutAsidePortalContext);
  const hasContent = Boolean(children);

  useEffect(() => {
    if (!hasContent) {
      return;
    }

    return register();
  }, [hasContent, register]);

  if (!hasContent || !container) {
    return null;
  }

  return createPortal(children, container);
};

export default LayoutAsidePortal;
