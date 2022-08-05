import React, { RefObject, useCallback } from 'react';
import { useEventListener } from './useEventListener';

export const useIsMouseIdle = <T extends HTMLElement>(ref: RefObject<T>, idleTime = 2500) => {
    // state
    const [isIdle, setIsIdle] = React.useState(true);

    // refs
    const timeOutRef = React.useRef<NodeJS.Timeout>();

    // handlers
    const handleMouseMove = useCallback(() => {
        if (isIdle) setIsIdle(false);
        // clear timeout
        if (timeOutRef.current !== undefined) clearTimeout(timeOutRef.current as NodeJS.Timeout);

        // set time out to check if mouse is idle
        timeOutRef.current = setTimeout(() => {
            setIsIdle(true);
        }, idleTime);
    }, [isIdle, idleTime]);

    // hooks
    useEventListener('mousemove', handleMouseMove, true, ref);
    useEventListener('mousedown', handleMouseMove, true, ref);

    return isIdle;
};
