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
    baselineSettings,
    baselineClosedCaption,
} from '../../utilities/icons/iconify';
import { VolumeControls } from './components/VolumeControls';
import { PlayPause } from './components/PlayPause';
import { FullScreenControls } from './components/FullScreenControls';
import { PlayerTimer } from './components/PlayerTimer';
import { CurrentHoverTime } from './components/CurrentHoverTime';

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
    } = { ...initialState, ...props };
    const { onProgressChange, onProgressDraggingStart, onProgressDraggingEnd } = progress;

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

    useEffect(() => {
        if (isDragging) onProgressDraggingStart();
        else onProgressDraggingEnd();
    }, [isDragging, onProgressDraggingStart, onProgressDraggingEnd]);

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
        setIsHovering(false);
        setProgressHoverPercentage(0);
    };
    const onProgressHeadDrag = (e: DragEvent<HTMLDivElement>) => {
        setEmptyDragElement(e);
        const dragPercentage = PlayerControlsService.getProgressHeadDragPercentage(
            e,
            progressTrackRef.current as HTMLDivElement,
        );
        setprogressPercentage(dragPercentage);
    };
    const onProgressHeadDragEnd = (e: MouseEvent<HTMLDivElement>) => {
        const dragPercentage = PlayerControlsService.getProgressHeadDragPercentage(
            e,
            progressTrackRef.current as HTMLDivElement,
        );
        setprogressPercentage(dragPercentage);
        setIsDragging(false);
        const dragTime = PlayerControlsService.getActualProgressValue(
            dragPercentage,
            progress.total,
        );
        onProgressChange(dragTime); // call callback from props to notify parent
    };

    // compute
    const currentProgressHoverPercentage = isDragging
        ? progressPercentage
        : progressHoverPercentage;
    const { current, total, currentHoverTime } = PlayerControlsService.getFormattedDuration(
        progress,
        progressPercentage,
        currentProgressHoverPercentage,
    );

    // paint
    return (
        <div className={cn(styles.wrapper, className)}>
            <div
                className={cn(styles.progressWrapper)}
                onMouseMove={onProgressMouseOver}
                onMouseOver={onProgressMouseOver}
                onMouseEnter={onProgressMouseOver}
                onMouseLeave={onProgressMouseLeave}
                onClick={onProgressHeadDragEnd}
                onDragStart={onProgressHeadDragStart}
                onDrag={onProgressHeadDrag}
                onDragEnd={onProgressHeadDragEnd}
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
                <CurrentHoverTime
                    isDragging={isDragging}
                    isHovering={isHovering}
                    currentHoverTime={currentHoverTime}
                    currentProgressHoverPercentage={currentProgressHoverPercentage}
                    progress={progress}
                    progressTrackWidth={progressTrackRef.current?.clientWidth ?? 0}
                />
            </div>
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
                    <PlayPause playPause={playPause} />
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
                    <VolumeControls volume={volume} />
                </div>
                <div className={cn(styles.controlsEndSectionWrapper)}>
                    <Icon
                        icon={baselineSettings}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: settings.isDisabled,
                        })}
                    />
                    <FullScreenControls fullScreen={fullScreen} />
                </div>
            </div>
        </div>
    );
};
