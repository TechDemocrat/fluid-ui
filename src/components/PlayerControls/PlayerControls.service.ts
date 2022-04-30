import { IconifyIcon } from '@iconify/types';
import { MouseEvent } from 'react';
import { getTextDimension } from '../../utilities';
import {
    baselineVolumeDown,
    baselineVolumeOff,
    baselineVolumeUp,
} from '../../utilities/icons/iconify';
import { IPlayerControlsProps } from './PlayerControls.types';

export class PlayerControlsService {
    static getInitialState(): IPlayerControlsProps {
        return {
            captions: { isCaptionsOn: false, isDisabled: true },
            fullscreen: { isFullscreen: false },
            next: { isDisabled: true },
            playPause: { isPlaying: false },
            previous: { isDisabled: true },
            progress: { current: 1250, total: 2500, fastForwardBackwardSpeed: 10 },
            repeat: { mode: 'off', isDisabled: true },
            settings: { isDisabled: true },
            shuffle: { isShuffled: false, isDisabled: true },
            volume: { currentLevel: 50, isMuted: false },
        };
    }

    static getProgressHoverPercentage = (e: MouseEvent<HTMLDivElement>): number => {
        const { clientX } = e;
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const percent = ((clientX - left) / width) * 100;
        if (percent < 0) {
            return 0;
        }
        if (percent > 100) {
            return 100;
        }
        return percent;
    };

    static getProgressHoverTime = (
        e: MouseEvent<HTMLDivElement>,
        totalDuration: number,
    ): number => {
        const percent = PlayerControlsService.getProgressHoverPercentage(e);
        const time = percent * totalDuration;
        return time;
    };

    static getProgressHoverTimeString = (
        e: MouseEvent<HTMLDivElement>,
        totalDuration: number,
    ): string => {
        const time = PlayerControlsService.getProgressHoverTime(e, totalDuration);
        const timeString = PlayerControlsService.getTimeString(time);
        return timeString;
    };

    static getTimeString = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        return timeString;
    };

    static getActualProgressValue = (totalValue: number, currentPercentage: number) =>
        (totalValue * currentPercentage) / 100;

    static getFormattedDuration = (
        progress: IPlayerControlsProps['progress'],
        currentProgressPercentage: number,
        progressHoverPercentage: number,
    ): { total: string; current: string; currentHoverTime: string } => {
        const total = PlayerControlsService.getTimeString(progress.total);
        const current = PlayerControlsService.getTimeString(
            PlayerControlsService.getActualProgressValue(progress.total, currentProgressPercentage),
        );
        const currentHoverTime = PlayerControlsService.getTimeString(
            PlayerControlsService.getActualProgressValue(progress.total, progressHoverPercentage),
        );
        return { total, current, currentHoverTime };
    };

    // get progress head drag position respective to progress track element width along with progress total
    static getProgressHeadDragPercentage = (
        e: MouseEvent<HTMLDivElement>,
        progressTrack: HTMLDivElement,
    ): number => {
        const { clientX } = e;
        const { left, width } = progressTrack.getBoundingClientRect();
        const percent = (clientX - left) / width;
        const progressHeadDragPercent = percent * 100;
        const previousPercentage = Number(e.currentTarget.style.left.split('%')[0]) ?? 0;
        if (progressHeadDragPercent > 100) return 100;
        if (progressHeadDragPercent < 0) return previousPercentage;
        return progressHeadDragPercent;
    };

    // get current progress percentage
    static getProgressPercentage = (progress: IPlayerControlsProps['progress']): number => {
        const progressPercentage = progress.current / progress.total;
        return progressPercentage * 100;
    };

    // get progress conent offset
    static getProgressHoverContentOffset = (
        currentProgressPercentage: number,
        totalProgressBarWidth: number,
        hoverContentWidth: number,
    ): number => {
        const currentProgressPosition = (totalProgressBarWidth * currentProgressPercentage) / 100;
        const remainingProgressBarWidth = totalProgressBarWidth - currentProgressPosition;
        const centeredHoverContentWidth = hoverContentWidth / 2;

        if (currentProgressPosition < centeredHoverContentWidth) {
            return -currentProgressPosition; // to have the smoothe transition handovers on end of progress bar
        }
        if (
            currentProgressPosition >= centeredHoverContentWidth &&
            remainingProgressBarWidth >= centeredHoverContentWidth
        ) {
            return -centeredHoverContentWidth;
        }
        if (remainingProgressBarWidth > centeredHoverContentWidth) {
            return -centeredHoverContentWidth;
        }
        return -(hoverContentWidth - remainingProgressBarWidth); // to have the smoothe transition handovers on end of progress bar
    };

    // get the max width of the hover content, indluding duration tooltip width as well as preview thumbnail width in future
    static getProgressHoverContentMaxWidth = (totalDuration: number): number => {
        const hoverContentFontSize = 12;
        const totalDurationString = PlayerControlsService.getTimeString(totalDuration);
        const { width: totalDurationWidth } = getTextDimension(totalDurationString, {
            fontSize: hoverContentFontSize,
        });
        return totalDurationWidth;
    };

    // get current volume icon based on volume percentage
    static getVolumeIcon = (volumePercentage: number): IconifyIcon => {
        if (volumePercentage === 0) return baselineVolumeOff;
        if (volumePercentage < 50) return baselineVolumeDown;
        return baselineVolumeUp;
    };
}
