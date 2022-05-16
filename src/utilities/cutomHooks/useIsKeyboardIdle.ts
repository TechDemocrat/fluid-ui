import { useCallback, useRef, useState } from 'react';
import { useEventListener } from './useEventListener';

export const useIsKeyboardIdle = (idleTime = 2500) => {
    // state
    const [isIdle, setIsIdle] = useState(true);

    // refs
    const timeOutRef = useRef<NodeJS.Timeout>();

    // handlers
    const handleKeyDown = useCallback(() => {
        if (isIdle) setIsIdle(false);

        // clear timeout if it exists
        clearTimeout(timeOutRef.current as NodeJS.Timeout);

        // set time out to check if mouse is idle
        timeOutRef.current = setTimeout(() => {
            setIsIdle(true);
        }, idleTime);
    }, [isIdle, idleTime]);

    // hooks
    useEventListener('keydown', handleKeyDown);

    return isIdle;
};
