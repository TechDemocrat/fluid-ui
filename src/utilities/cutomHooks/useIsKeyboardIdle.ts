import React, { useEffect } from 'react';

export const useIsKeyboardIdle = (idleTime = 2500) => {
    // state
    const [isIdle, setIsIdle] = React.useState(false);

    // refs
    const timeOutRef = React.useRef<NodeJS.Timeout>();

    // effect
    useEffect(() => {
        const handleKeyDown = () => {
            if (isIdle) setIsIdle(false);
            // clear timeout
            if (timeOutRef.current !== undefined)
                clearTimeout(timeOutRef.current as NodeJS.Timeout);

            // set time out to check if mouse is idle
            timeOutRef.current = setTimeout(() => {
                setIsIdle(true);
            }, idleTime);
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isIdle, idleTime]);

    return isIdle;
};
