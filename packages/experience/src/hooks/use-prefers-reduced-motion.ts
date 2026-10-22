import { useEffect, useState } from 'react';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

const getPrefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(reducedMotionQuery).matches;

/**
 * Tracks `prefers-reduced-motion: reduce`, including changes made while the page is open.
 * Decorative motion (the auth noise video, the co-researcher sparkle) should stay off when this
 * is true.
 */
const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPrefersReducedMotion);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }

    const query = window.matchMedia(reducedMotionQuery);
    const handleChange = () => {
      setPrefersReducedMotion(query.matches);
    };

    handleChange();
    query.addEventListener('change', handleChange);

    return () => {
      query.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

export default usePrefersReducedMotion;
