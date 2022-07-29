import React, { CSSProperties, Dispatch, MutableRefObject, useEffect, useRef } from 'react';
import cn from 'classnames';
import styles from '../VideoPlayer.module.scss';
import { Icon } from '@iconify/react';
import {
    baselineFastForward,
    baselineFastRewind,
    baselinePause,
    baselinePlayArrow,
    baselineVolumeDown,
    baselineVolumeOff,
    baselineVolumeUp,
} from '../../../assets/icons/iconify';
import { Spinner } from '../../Spinner/Spinner';

export type TAccessibilityType =
    | 'play'
    | 'pause'
    | 'seekForward'
    | 'seekBackward'
    | 'volumeUp'
    | 'volumeDown'
    | 'volumeMute'
    | null;

type TSeekPosition = 'center' | 'left' | 'right';

interface IPlayerAccessibilityLayerProps {
    actionType: TAccessibilityType;
    isLoading: boolean;
    isFullScreen: boolean;
    setActionType: Dispatch<TAccessibilityType>;
    seekSpeed?: number | string;
    seekSpeedFormatter?: (speed?: string | number) => string;
}

export const PlayerAccessibilityLayer = (props: IPlayerAccessibilityLayerProps) => {
    // props
    const { actionType, isFullScreen, seekSpeed, isLoading, setActionType, seekSpeedFormatter } =
        props;

    // locals
    const accessibilityIconTransitionTime = 400; // in milliseconds

    // refs
    const timOutRef = useRef<NodeJS.Timeout>(null) as MutableRefObject<NodeJS.Timeout>;
    const accessibilityIconWrapperRef = useRef<HTMLDivElement>(null);

    // effects
    useEffect(() => {
        if (actionType !== null) {
            clearTimeout(timOutRef.current as NodeJS.Timeout);
            accessibilityIconWrapperRef.current?.classList.add(styles.showAccessibilityIcon);
            timOutRef.current = setTimeout(() => {
                setActionType(null);
                accessibilityIconWrapperRef.current?.classList.remove(styles.showAccessibilityIcon);
            }, accessibilityIconTransitionTime);
        }
        return () => {
            clearTimeout(timOutRef.current as NodeJS.Timeout);
        };
    }, [actionType, setActionType]);

    // paint
    const getActionIcon = () => {
        switch (actionType) {
            case 'play':
                return <Icon className={styles.accessibilityIcon} icon={baselinePlayArrow} />;
            case 'pause':
                return <Icon className={styles.accessibilityIcon} icon={baselinePause} />;
            case 'seekForward':
                return (
                    <div className={styles.accessibilitySeekIconWrapper}>
                        <Icon className={styles.accessibilityIcon} icon={baselineFastForward} />
                        <span>{seekSpeedFormatter?.(seekSpeed) ?? `${seekSpeed} sec`}</span>
                    </div>
                );
            case 'seekBackward':
                return (
                    <div className={styles.accessibilitySeekIconWrapper}>
                        <Icon className={styles.accessibilityIcon} icon={baselineFastRewind} />
                        <span>{seekSpeedFormatter?.(seekSpeed) ?? `${seekSpeed} sec`}</span>
                    </div>
                );
            case 'volumeUp':
                return <Icon className={styles.accessibilityIcon} icon={baselineVolumeUp} />;
            case 'volumeDown':
                return <Icon className={styles.accessibilityIcon} icon={baselineVolumeDown} />;
            case 'volumeMute':
                return <Icon className={styles.accessibilityIcon} icon={baselineVolumeOff} />;
            default:
                return null;
        }
    };

    // compute
    let seekPosition: TSeekPosition = 'center';
    if (actionType === 'seekForward') seekPosition = 'right';
    else if (actionType === 'seekBackward') seekPosition = 'left';

    return (
        <>
            <div
                className={cn(styles.accessibilityIconWrapper, {
                    [styles.accessibilityPositionLeft]: seekPosition === 'left',
                    [styles.accessibilityPositionRight]: seekPosition === 'right',
                })}
            >
                <div
                    ref={accessibilityIconWrapperRef}
                    className={cn(styles.accessibilityIconHolder)}
                    style={
                        {
                            '--accessibility-icon-transition-time': `${accessibilityIconTransitionTime}ms`,
                        } as CSSProperties
                    }
                >
                    {getActionIcon()}
                </div>
            </div>
            {isLoading && (
                <div
                    className={styles.loaderWrapper}
                    style={
                        {
                            '--custom-loader-size': isFullScreen ? '80px' : '60px',
                        } as CSSProperties
                    }
                >
                    <Spinner color="tertiary" className={styles.customLoader} />
                </div>
            )}
        </>
    );
};
