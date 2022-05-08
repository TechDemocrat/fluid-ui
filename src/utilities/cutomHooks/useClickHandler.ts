import {
    MouseEventHandler,
    useEffect,
    MouseEvent,
    useRef,
    useState,
    MutableRefObject,
} from 'react';

type THookState<T = HTMLDivElement> = MouseEvent<T, globalThis.MouseEvent>;

export interface IUseClickHandlerProps<T = HTMLDivElement> {
    onSingleClick?: MouseEventHandler<T>;
    onSingleClickWithShift?: MouseEventHandler<T>;
    onDoubleClick?: MouseEventHandler<T>;
    onDoubleClickWithShift?: MouseEventHandler<T>;
    delay?: number;
    stopPropagation?: boolean;
}

export const useClickHandler = <T = HTMLDivElement>(props: IUseClickHandlerProps<T>) => {
    const {
        delay = 200,
        stopPropagation,
        onDoubleClick,
        onSingleClick,
        onSingleClickWithShift,
        onDoubleClickWithShift,
    } = props;
    const [count, setCount] = useState(0);
    const eventRef = useRef<MouseEvent<T, globalThis.MouseEvent>>(null) as MutableRefObject<
        MouseEvent<T, globalThis.MouseEvent>
    >;

    useEffect(() => {
        const timer = setTimeout(() => {
            // single click
            if (count === 1) {
                if (eventRef.current?.shiftKey) {
                    onSingleClickWithShift?.(eventRef.current);
                } else {
                    onSingleClick?.(eventRef.current as MouseEvent<T>);
                }
            }
            setCount(0);
        }, delay);
        // the duration between this click and the previous one is less than the value of delay = double-click
        if (count === 2) {
            if (eventRef.current?.shiftKey) {
                onDoubleClickWithShift?.(eventRef.current);
            } else {
                onDoubleClick?.(eventRef.current as MouseEvent<T>);
            }
        }

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);

    return (event: THookState<T>) => {
        if (stopPropagation) event?.stopPropagation();
        if (eventRef.current) eventRef.current = event;
        setCount(count + 1);
    };
};
