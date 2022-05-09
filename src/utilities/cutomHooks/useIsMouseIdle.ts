import React, { RefObject, useEffect } from 'react';

export const useIsMouseIdle = <T extends HTMLElement>(ref: RefObject<T>, idleTime = 2500) => {
    // state
    const [isIdle, setIsIdle] = React.useState(false);

    // refs
    const timeOutRef = React.useRef<NodeJS.Timeout>();

    // effect
    useEffect(() => {
        const currentElement = ref.current;

        const handleMouseMove = () => {
            if (isIdle) setIsIdle(false);
            // clear timeout
            if (timeOutRef.current !== undefined)
                clearTimeout(timeOutRef.current as NodeJS.Timeout);

            // set time out to check if mouse is idle
            timeOutRef.current = setTimeout(() => {
                setIsIdle(true);
            }, idleTime);
        };

        if (currentElement) {
            currentElement.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            currentElement?.removeEventListener('mousemove', handleMouseMove);
        };
    }, [ref, isIdle, idleTime]);

    return isIdle;
};
