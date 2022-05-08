import React, {
    CSSProperties,
    Dispatch,
    MouseEventHandler,
    MutableRefObject,
    useEffect,
    useRef,
} from 'react';
import cn from 'classnames';
import styles from '../VideoPlayer.module.scss';

export type TAccessibilityType = 'play' | 'pause' | null;

interface IPlayerAccessibilityLayerProps {
    actionType: TAccessibilityType;
    setActionType: Dispatch<TAccessibilityType>;
    onClick: MouseEventHandler<HTMLDivElement>;
}

export const PlayerAccessibilityLayer = (props: IPlayerAccessibilityLayerProps) => {
    // props
    const { actionType, setActionType, onClick } = props;

    // locals
    const accessibilityIconTransitionTime = 200; // in milliseconds

    // refs
    const timoutRef = useRef<NodeJS.Timeout>(null) as MutableRefObject<NodeJS.Timeout>;

    // effects
    useEffect(() => {
        if (actionType !== null) {
            clearTimeout(timoutRef.current as NodeJS.Timeout);
            timoutRef.current = setTimeout(() => {
                setActionType(null);
            }, accessibilityIconTransitionTime * 2);
        }
        return () => {
            clearTimeout(timoutRef.current as NodeJS.Timeout);
        };
    }, [actionType, setActionType]);

    // paint
    return (
        <div className={cn(styles.playerAccessibilityLayer)} onClick={onClick}>
            <div
                className={cn(styles.accessibilityIconWrapper, {
                    [styles.showAccessibilityIcon]: actionType !== null,
                })}
                style={
                    {
                        '--accesibility-icon-transition-time': `${accessibilityIconTransitionTime}ms`,
                    } as CSSProperties
                }
            >
                {actionType}
            </div>
        </div>
    );
};
