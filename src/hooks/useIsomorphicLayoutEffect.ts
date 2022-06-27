import { useEffect, useLayoutEffect } from 'react';

/**
 * it matches the effect based on the environment
 */

export const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;
