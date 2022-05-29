import { useEffect, useState } from 'react';

export const useProgressTimer = (
    /**
     * The total of the progress eg: 100%
     */
    progressTotal: number,
    /**
     * playback speed, this determines how much the progress will get to the total (in percentage)
     */
    playbackRate: number,
    /**
     * playback speed, this determines how fast the progress will get to the total (in ms)
     */
    playbackSpeed: number,
    /**
     * will be called when the timer is done
     */
    callback: () => void,
    /**
     * auto start the timer props
     */
    startImmediately = false,
    startImmediatelyDelay = 0,
) => {
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    const start = () => {
        setIsRunning(true);
        setIsPaused(false);
        setProgress(0);
    };

    const pause = () => {
        setIsPaused(true);
        setIsRunning(false);
    };

    const resume = () => {
        setIsPaused(false);
        setIsRunning(true);
    };

    const stop = () => {
        setIsRunning(false);
        setIsPaused(false);
        setProgress(0);
    };

    const reset = () => {
        setIsRunning(false);
        setIsPaused(false);
        setProgress(0);
    };

    useEffect(() => {
        if (startImmediately) {
            setTimeout(() => {
                start();
            }, startImmediatelyDelay);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isRunning) {
            const timer = setInterval(() => {
                if (isPaused) {
                    return;
                }

                const newProgress = progress + playbackRate;
                if (newProgress >= progressTotal) {
                    setProgress(newProgress);
                    clearInterval(timer);
                    callback();
                } else {
                    setProgress(newProgress);
                }
            }, playbackSpeed);

            return () => {
                clearInterval(timer);
            };
        }
    }, [isRunning, isPaused, progress, progressTotal, playbackRate, playbackSpeed, callback]);

    return {
        isRunning,
        isPaused,
        progress,
        start,
        pause,
        resume,
        stop,
        reset,
    };
};
