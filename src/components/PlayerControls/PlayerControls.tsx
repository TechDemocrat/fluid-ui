import React, { DragEvent, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { Icon } from '@iconify/react';

import { IPlayerControlsProps } from './PlayerControls.types';
import styles from './PlayerControls.module.scss';
import { PlayerControlsService } from './PlayerControls.service';
import {
    baselineRepeat,
    baselineShuffle,
    baselineSkipPrevious,
    baselineSkipNext,
    baselineClosedCaption,
} from '../../assets/icons/iconify';
import { PlayerVolumeControls } from './components/PlayerVolumeControls';
import { PlayerPlayPause } from './components/PlayerPlayPause';
import { PlayerFullScreenControls } from './components/PlayerFullScreenControls';
import { PlayerTimer } from './components/PlayerTimer';
import { PlayerProgressBar } from './components/PlayerProgressBar';
import { PlayerSettings } from './components/PlayerSettings';
import { useEventListener } from '../../hooks';

export const PlayerControls = (props: IPlayerControlsProps) => {
    // props
    const initialState = useMemo(() => PlayerControlsService.getInitialState(), []);
    const {
        className,
        captions,
        fullScreen,
        next,
        playPause,
        previous,
        progress,
        repeat,
        settings,
        shuffle,
        volume,
        setAccessibilityActionType: setAccessibilityActionType,
    } = { ...initialState, ...props };
    const { onProgressChange, onProgressDragStart, onProgressDragEnd } = progress;

    // refs
    const progressTrackRef = useRef<HTMLDivElement>(null);

    // state
    const [progressPercentage, setProgressPercentage] = useState(
        PlayerControlsService.getProgressPercentage(progress.current, progress.total),
    );
    const [progressHoverPercentage, setProgressHoverPercentage] = useState<number>(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // effects
    useEffect(() => {
        setProgressPercentage(
            PlayerControlsService.getProgressPercentage(progress.current, progress.total),
        );
    }, [progress]);

    // handlers
    const onPlayerControlsWrapperClick = (event: MouseEvent<HTMLDivElement>) => {
        // player controls wrapper click bubbling restriction -
        // this helps fullscreen on double click and play pause action on single click by parent overall wrapper
        event.stopPropagation();
    };

    // on track hover handlers
    const onProgressMouseOver = (e: MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            setIsHovering(false);
            setProgressHoverPercentage(0);
        } else {
            setProgressHoverPercentage(PlayerControlsService.getProgressHoverPercentage(e));
            setIsHovering(true);
        }
    };

    const onProgressMouseLeave = () => {
        setIsHovering(false);
        setProgressHoverPercentage(0);
    };

    // progress head handlers
    const onProgressHeadDragStart = (e: DragEvent<HTMLDivElement>) => {
        PlayerControlsService.setEmptyDragElement(e);
        setIsDragging(true);
        setIsHovering(false);
        setProgressHoverPercentage(0);
        onProgressDragStart(); // callback to parent
    };

    const onProgressHeadDrag = (e: DragEvent<HTMLDivElement>) => {
        PlayerControlsService.setEmptyDragElement(e);
        const dragPercentage = PlayerControlsService.getProgressHeadDragPercentage(
            e,
            progressTrackRef.current as HTMLDivElement,
        );
        setProgressPercentage(dragPercentage);
    };

    const onProgressHeadDragEnd = (e: MouseEvent<HTMLDivElement>) => {
        const dragPercentage = PlayerControlsService.getProgressHeadDragPercentage(
            e,
            progressTrackRef.current as HTMLDivElement,
        );
        setProgressPercentage(dragPercentage);
        setIsDragging(false);
        const dragTime = PlayerControlsService.getActualProgressValue(
            dragPercentage,
            progress.total,
        );
        onProgressChange(dragTime); // call callback from props to notify parent
        onProgressDragEnd(); // callback to parent
    };

    const getUpdatedProgressTime = (type: 'up' | 'down') => {
        let updatedTime = PlayerControlsService.getActualProgressValue(
            progressPercentage,
            progress.total,
        );
        if (type === 'up') {
            updatedTime = updatedTime + progress.fastForwardBackwardSpeed;
            updatedTime = updatedTime > progress.total ? progress.total : updatedTime;
        } else {
            updatedTime = updatedTime - progress.fastForwardBackwardSpeed;
            updatedTime = updatedTime < 0 ? 0 : updatedTime;
        }
        return updatedTime;
    };

    const onKeyDown = (e: WindowEventMap['keydown']) => {
        // if ArrowUp key is pressed and volume is not muted then increase volume by 10%
        // and call callback from props to notify parent to update volume
        // if m key is pressed then mute volume
        if (e.key === 'ArrowRight') {
            const updatedTime = getUpdatedProgressTime('up');
            onProgressChange(updatedTime); // call callback from props to notify parent
            setAccessibilityActionType('seekForward');
        } else if (e.key === 'ArrowLeft') {
            const updatedTime = getUpdatedProgressTime('down');
            onProgressChange(updatedTime); // call callback from props to notify parent
            setAccessibilityActionType('seekBackward');
        }
    };

    // hooks
    useEventListener('keydown', onKeyDown, true);

    // compute
    const { current, total } = PlayerControlsService.getFormattedDuration(
        progress,
        progressPercentage,
    );

    const isReachedEnd = progressPercentage === 100;

    // paint
    return (
        <div className={cn(styles.wrapper, className)} onClick={onPlayerControlsWrapperClick}>
            <PlayerProgressBar
                ref={progressTrackRef}
                progress={progress}
                progressPercentage={progressPercentage}
                progressHoverPercentage={progressHoverPercentage}
                isDragging={isDragging}
                isHovering={isHovering}
                onMouseMove={onProgressMouseOver}
                onMouseOver={onProgressMouseOver}
                onMouseEnter={onProgressMouseOver}
                onMouseLeave={onProgressMouseLeave}
                onClick={onProgressHeadDragEnd}
                onDragStart={onProgressHeadDragStart}
                onDrag={onProgressHeadDrag}
                onDragEnd={onProgressHeadDragEnd}
            />
            <div className={cn(styles.controlsWrapper)}>
                <div className={cn(styles.controlsStartSectionWrapper)}>
                    <PlayerTimer current={current} total={total} />
                </div>
                <div className={cn(styles.controlsMiddleSectionWrapper)}>
                    <div>
                        <Icon
                            icon={baselineShuffle}
                            className={cn(styles.actionIcon, {
                                [styles.iconDisabled]: shuffle.isDisabled,
                            })}
                            onClick={shuffle.onClick}
                        />
                    </div>
                    <div>
                        <Icon
                            icon={baselineRepeat}
                            className={cn(styles.actionIcon, {
                                [styles.iconDisabled]: repeat.isDisabled,
                            })}
                        />
                    </div>
                    <div>
                        <Icon
                            icon={baselineSkipPrevious}
                            className={cn(styles.actionIcon, {
                                [styles.iconDisabled]: previous.isDisabled,
                            })}
                            onClick={previous.onClick}
                        />
                    </div>
                    <PlayerPlayPause playPause={playPause} isReachedEnd={isReachedEnd} />
                    <div>
                        <Icon
                            icon={baselineSkipNext}
                            className={cn(styles.actionIcon, {
                                [styles.iconDisabled]: next.isDisabled,
                            })}
                            onClick={next.onClick}
                        />
                    </div>
                    <div>
                        <Icon
                            icon={baselineClosedCaption}
                            className={cn(styles.actionIcon, {
                                [styles.iconDisabled]: captions.isDisabled,
                            })}
                            onClick={captions.onClick}
                        />
                    </div>
                    <PlayerVolumeControls
                        volume={volume}
                        setAccessibilityActionType={setAccessibilityActionType}
                    />
                </div>
                <div className={cn(styles.controlsEndSectionWrapper)}>
                    <PlayerSettings isDisabled={settings.isDisabled} />
                    <PlayerFullScreenControls fullScreen={fullScreen} />
                </div>
            </div>
        </div>
    );
};
