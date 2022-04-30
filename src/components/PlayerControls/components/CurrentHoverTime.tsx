import React, { useMemo } from 'react';
import cn from 'classnames';
import styles from '../PlayerControls.module.scss';
import { PlayerControlsService } from '../PlayerControls.service';
import { IPlayerControlsProps } from '../PlayerControls.types';

export const CurrentHoverTime = (props: {
    isDragging: boolean;
    isHovering: boolean;
    progress: IPlayerControlsProps['progress'];
    currentHoverTime: string;
    currentProgressHoverPercentage: number;
    progressTrackWidth: number;
}) => {
    // props
    const {
        progress,
        currentHoverTime,
        isDragging,
        isHovering,
        currentProgressHoverPercentage,
        progressTrackWidth,
    } = props;

    // compute
    const progerssHoverContentMaxWidth = useMemo(
        () => PlayerControlsService.getProgressHoverContentMaxWidth(progress.total),
        [progress.total],
    );
    const progressHoverContentOffset = PlayerControlsService.getProgressHoverContentOffset(
        currentProgressHoverPercentage,
        progressTrackWidth ?? 0,
        progerssHoverContentMaxWidth,
    );

    // paint
    if (!(isDragging || isHovering)) return null;

    return (
        <div
            className={cn(styles.progressHoverContent)}
            style={{
                left: `${currentProgressHoverPercentage}%`,
                marginLeft: `${progressHoverContentOffset}px`,
            }}
        >
            {currentHoverTime}
        </div>
    );
};
