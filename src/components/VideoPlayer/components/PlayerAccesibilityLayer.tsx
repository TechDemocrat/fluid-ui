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
import { Icon } from '@iconify/react';
import {
    baselineFastForward,
    baselineFastRewind,
    baselinePause,
    baselinePlayArrow,
    baselineVolumeDown,
    baselineVolumeOff,
    baselineVolumeUp,
} from '../../../utilities/icons/iconify';
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
    seekSpeed: number;
    isLoading: boolean;
    isFullScreen: boolean;
    setActionType: Dispatch<TAccessibilityType>;
    onClick: MouseEventHandler<HTMLDivElement>;
}

export const PlayerAccessibilityLayer = (props: IPlayerAccessibilityLayerProps) => {
    // props
    const { actionType, isFullScreen, seekSpeed, isLoading, setActionType, onClick } = props;

    // locals
    const accessibilityIconTransitionTime = 400; // in milliseconds

    // refs
    const timoutRef = useRef<NodeJS.Timeout>(null) as MutableRefObject<NodeJS.Timeout>;
    const accessiblityIconWrapperRef = useRef<HTMLDivElement>(null);

    // effects
    useEffect(() => {
        if (actionType !== null) {
            clearTimeout(timoutRef.current as NodeJS.Timeout);
            accessiblityIconWrapperRef.current?.classList.add(styles.showAccessibilityIcon);
            timoutRef.current = setTimeout(() => {
                setActionType(null);
                accessiblityIconWrapperRef.current?.classList.remove(styles.showAccessibilityIcon);
            }, accessibilityIconTransitionTime);
        }
        return () => {
            clearTimeout(timoutRef.current as NodeJS.Timeout);
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
                        <span>{seekSpeed} sec</span>
                    </div>
                );
            case 'seekBackward':
                return (
                    <div className={styles.accessibilitySeekIconWrapper}>
                        <Icon className={styles.accessibilityIcon} icon={baselineFastRewind} />
                        <span>{seekSpeed} sec</span>
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
        <div className={cn(styles.playerAccessibilityLayer)} onClick={onClick}>
            <div
                ref={accessiblityIconWrapperRef}
                className={cn(styles.accessibilityIconWrapper, {
                    [styles.accessibilityPositionRight]: seekPosition === 'right',
                    [styles.accessibilityPositionLeft]: seekPosition === 'left',
                })}
                style={
                    {
                        '--accesibility-icon-transition-time': `${accessibilityIconTransitionTime}ms`,
                    } as CSSProperties
                }
            >
                {getActionIcon()}
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
        </div>
    );
};
