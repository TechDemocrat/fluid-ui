import { useCallback, useState } from 'react';
import { useEventListener } from './useEventListener';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

interface Size {
    width: number;
    height: number;
    scrollWidth: number;
    scrollHeight: number;
}

export function useElementSize<T extends HTMLElement = HTMLDivElement>(): [
    (node: T | null) => void,
    Size,
] {
    // Mutable values like 'ref.current' aren't valid dependencies
    // because mutating them doesn't re-render the component.
    // Instead, we use a state as a ref to be reactive.
    const [ref, setRef] = useState<T | null>(null);
    const [size, setSize] = useState<Size>({
        width: 0,
        height: 0,
        scrollWidth: 0,
        scrollHeight: 0,
    });

    // Prevent too many rendering using useCallback
    const handleSize = useCallback(() => {
        setSize({
            width: ref?.offsetWidth || 0,
            height: ref?.offsetHeight || 0,
            scrollWidth: ref?.scrollWidth || 0,
            scrollHeight: ref?.scrollHeight || 0,
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref?.offsetHeight, ref?.offsetWidth]);

    useEventListener('resize', handleSize, true);

    useIsomorphicLayoutEffect(() => {
        handleSize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref?.offsetHeight, ref?.offsetWidth]);

    return [setRef, size];
}
