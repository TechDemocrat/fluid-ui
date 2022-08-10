import { useCallback } from 'react';
import { useBoolean } from './useBoolean';
import { useCounter } from './useCounter';
import { useInterval } from './useInterval';

interface CountdownOption {
    countStart: number;
    intervalMs?: number;
    isIncrement?: boolean;
    countStop?: number;
}
interface CountdownControllers {
    startCountdown: () => void;
    stopCountdown: () => void;
    resetCountdown: () => void;
}

/**
 * @param  {CountdownOption} countdownOption
 * @param  {number} countdownOption.countStart - the countdown's starting number, initial value of the returned number.
 * @param  {?number} countdownOption.countStop -  `0` by default, the countdown's stopping number. Pass `-Infinity` to decrease forever.
 * @param  {?number} countdownOption.intervalMs - `1000` by default, the countdown's interval, in milliseconds.
 * @param  {?boolean} countdownOption.isIncrement - `false` by default, true if the countdown is increment.
 * @returns [counter, CountdownControllers]
 */
function useCountdown(countdownOption: CountdownOption): [number, CountdownControllers];

function useCountdown(countdownOption: CountdownOption): [number, CountdownControllers] {
    // props
    const {
        countStart,
        intervalMs = 1000,
        isIncrement = false,
        countStop = 0,
    } = countdownOption ?? {};

    // hooks
    const { count, increment, decrement, reset: resetCounter } = useCounter(countStart);

    /**
     * Note: used to control the useInterval
     * running: If true, the interval is running
     * start: Should set running true to trigger interval
     * stop: Should set running false to remove interval
     */
    const {
        value: isCountdownRunning,
        setTrue: startCountdown,
        setFalse: stopCountdown,
    } = useBoolean(false);

    /**
     * Will set running false and reset the seconds to initial value
     */
    const resetCountdown = () => {
        stopCountdown();
        resetCounter();
    };

    const countdownCallback = useCallback(() => {
        if (count === countStop) {
            stopCountdown();
            return;
        }

        if (isIncrement) {
            increment();
        } else {
            decrement();
        }
    }, [count, countStop, decrement, increment, isIncrement, stopCountdown]);

    useInterval(countdownCallback, isCountdownRunning ? intervalMs : null);

    return [
        count,
        {
            startCountdown,
            stopCountdown,
            resetCountdown,
        } as CountdownControllers,
    ];
}

export default useCountdown;
