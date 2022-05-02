import { useCallback, useEffect, useRef } from 'react';

/**
 *
 * @returns isMounted() cb which returns a boolean states that the component is mounted or not
 *
 */
export const useIsMounted = (): (() => boolean) => {
    // refs
    const isMountedRef = useRef(false);

    // effects
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return useCallback(() => isMountedRef.current, []);
};
