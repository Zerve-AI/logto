import { renderHook } from '@testing-library/react-hooks';

import usePrefersReducedMotion from './use-prefers-reduced-motion';

const mockMatchMedia = (matches: boolean) => {
  const query = {
    matches,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  // eslint-disable-next-line @silverhand/fp/no-mutation -- jsdom does not implement matchMedia
  window.matchMedia = jest.fn().mockReturnValue(query);

  return query;
};

describe('usePrefersReducedMotion', () => {
  it('is true when the user requests reduced motion', () => {
    mockMatchMedia(true);

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(true);
  });

  it('is false when reduced motion is not requested', () => {
    mockMatchMedia(false);

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);
  });
});
