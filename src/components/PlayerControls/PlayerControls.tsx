import React, { DragEvent, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { Icon } from '@iconify/react';

import { IPlayerControlsProps } from './PlayerControls.types';
import styles from './PlayerControls.module.scss';
import { PlayerControlsService } from './PlayerControls.service';
import {
    baselinePlayArrow,
    // baselinePause,
    baselineRepeat,
    // baselineRepeatOne,
    baselineShuffle,
    baselineSkipPrevious,
    baselineSkipNext,
    baselineVolumeUp,
    // baselineVolumeDown,
    // baselineVolumeOff,
    baselineFullscreen,
    // baselineFullscreenExit,
    baselineSettings,
    baselineClosedCaption,
} from '../../utilities/icons/iconify';

export const PlayerControls = (props: IPlayerControlsProps) => {
    // props
    const initialState = useMemo(() => PlayerControlsService.getInitialState(), []);
    const {
        captions,
        fullscreen,
        next,
        playPause,
        previous,
        progress,
        repeat,
        settings,
        shuffle,
        volume,
    } = { ...initialState, ...props };

    // refs
    const progressTrackRef = useRef<HTMLDivElement>(null);

    // state
    const [progressPercentage, setprogressPercentage] = useState(
        PlayerControlsService.getProgressPercentage(progress),
    );
    const [progressHoverPercentage, setProgressHoverPercentage] = useState<number>(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // effects
    useEffect(() => {
        setprogressPercentage(PlayerControlsService.getProgressPercentage(progress));
    }, [progress]);

    // handlers
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
    const setEmptyDragElement = (e: DragEvent<HTMLDivElement>) => {
        const emptyElement = document.createElement('img');
        e.dataTransfer.setDragImage(emptyElement, 0, 0); // remove drag image
    };
    const onProgressHeadDragStart = (e: DragEvent<HTMLDivElement>) => {
        setEmptyDragElement(e);
        setIsDragging(true);
    };
    const onProgressHeadDrag = (e: DragEvent<HTMLDivElement>) => {
        setEmptyDragElement(e);
        const { dragPercentage } = PlayerControlsService.getProgressHeadDragPosition(
            e,
            progressTrackRef.current as HTMLDivElement,
            progress,
        );
        setprogressPercentage(dragPercentage);
    };
    const onProgressHeadDragEnd = (e: MouseEvent<HTMLDivElement>) => {
        const { dragPercentage, dragTime } = PlayerControlsService.getProgressHeadDragPosition(
            e,
            progressTrackRef.current as HTMLDivElement,
            progress,
        );
        setprogressPercentage(dragPercentage);
        setIsDragging(false);
        progress.onProgressChange?.(dragTime); // call callback from props to notify parent
    };

    // compute
    const currentProgressHoverPercentage = isDragging
        ? progressPercentage
        : progressHoverPercentage;
    const progerssHoverContentMaxWidth = useMemo(
        () => PlayerControlsService.getProgressHoverContentMaxWidth(progress.total),
        [progress.total],
    );
    const { total, current, hoverDuration } = PlayerControlsService.getFormattedDuration(
        progress,
        progressPercentage,
        currentProgressHoverPercentage,
    );
    const progressHoverContentOffset = PlayerControlsService.getProgressHoverContentOffset(
        currentProgressHoverPercentage,
        progressTrackRef.current?.clientWidth ?? 0,
        progerssHoverContentMaxWidth,
    );

    // paint
    return (
        <div className={cn(styles.wrapper)}>
            <div
                className={cn(styles.progressWrapper)}
                onMouseMove={onProgressMouseOver}
                onMouseOver={onProgressMouseOver}
                onMouseEnter={onProgressMouseOver}
                onMouseLeave={onProgressMouseLeave}
                onClick={onProgressHeadDragEnd}
            >
                <div className={cn(styles.progress, styles.progressPadding)} />
                <div className={cn(styles.progress, styles.progressTrack)} ref={progressTrackRef} />
                <div
                    className={cn(styles.progress, styles.progressBar)}
                    style={{ width: `${progressPercentage}%` }}
                />
                <div className={cn(styles.progress, styles.progressBuffer)} />
                <div
                    className={cn(styles.progress, styles.progressHover)}
                    style={{
                        width: `${progressHoverPercentage}%`,
                    }}
                />
                {(isDragging || isHovering) && (
                    <div
                        className={cn(styles.progressHoverContent)}
                        style={{
                            left: `${currentProgressHoverPercentage}%`,
                            marginLeft: `${progressHoverContentOffset}px`,
                        }}
                    >
                        {hoverDuration}
                    </div>
                )}
                <div
                    draggable
                    className={cn(styles.progress, styles.progressHead)}
                    style={{
                        left: `${progressPercentage}%`,
                    }}
                    onDragStart={onProgressHeadDragStart}
                    onDrag={onProgressHeadDrag}
                    onDragEnd={onProgressHeadDragEnd}
                />
            </div>
            <div className={cn(styles.controlsWrapper)}>
                <div className={cn(styles.controlsStartSectionWrapper)}>
                    <div className={cn(styles.durationWrapper)}>
                        <span>{current ?? '-'}</span>
                        <span>/</span>
                        <span>{total ?? '-'}</span>
                    </div>
                </div>
                <div className={cn(styles.controlsMiddleSectionWrapper)}>
                    <Icon
                        icon={baselineShuffle}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: shuffle.isDisabled,
                        })}
                        onClick={shuffle.onClick}
                    />
                    <Icon
                        icon={baselineRepeat}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: repeat.isDisabled,
                        })}
                        // onClick={repeat.onClick} // needs wrapper
                    />
                    <Icon
                        icon={baselineSkipPrevious}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: previous.isDisabled,
                        })}
                        onClick={previous.onClick}
                    />
                    <Icon
                        icon={baselinePlayArrow}
                        className={cn(styles.actionIcon, styles.playPauseIcon, {
                            [styles.iconDisabled]: playPause.isDisabled,
                        })}
                        onClick={playPause.onClick}
                    />
                    <Icon
                        icon={baselineSkipNext}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: next.isDisabled,
                        })}
                        onClick={next.onClick}
                    />
                    <Icon
                        icon={baselineClosedCaption}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: captions.isDisabled,
                        })}
                        onClick={captions.onClick}
                    />
                    <Icon
                        icon={baselineVolumeUp}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: volume.isDisabled,
                        })}
                        // onClick={volume.onClick} // needs wrapper
                    />
                </div>
                <div className={cn(styles.controlsEndSectionWrapper)}>
                    <Icon
                        icon={baselineSettings}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: settings.isDisabled,
                        })}
                    />
                    <Icon
                        icon={baselineFullscreen}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: fullscreen.isDisabled,
                        })}
                        onClick={fullscreen.onClick}
                    />
                </div>
            </div>
        </div>
    );
};
