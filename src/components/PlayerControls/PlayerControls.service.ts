import { MouseEvent } from 'react';
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
            volume: { currentLevel: 0 },
        };
    }

    static getProgressHoverPercent = (e: MouseEvent<HTMLDivElement>): number => {
        const { clientX } = e;
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const percent = (clientX - left) / width;
        return percent * 100;
    };

    static getProgressHoverTime = (
        e: MouseEvent<HTMLDivElement>,
        totalDuration: number,
    ): number => {
        const percent = PlayerControlsService.getProgressHoverPercent(e);
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

    static getFormattedDuration = (
        progress: IPlayerControlsProps['progress'],
        currentProgressPercentage: number,
    ): { total: string; current: string } => {
        const total = PlayerControlsService.getTimeString(progress.total);
        const current = PlayerControlsService.getTimeString(
            (progress.total * currentProgressPercentage) / 100,
        );
        return { total, current };
    };

    // get progress head drag position respective to progress track element width along with progress total
    static getProgressHeadDragPercent = (
        e: MouseEvent<HTMLDivElement>,
        progressTrack: HTMLDivElement,
    ): number => {
        const { clientX } = e;
        const { left, width } = progressTrack.getBoundingClientRect();
        const percent = (clientX - left) / width;
        const progressHeadDragPercent = percent * 100;
        if (progressHeadDragPercent > 100) return 100;
        if (progressHeadDragPercent < 0) return 0;
        return progressHeadDragPercent;
    };

    // get progress head's drag position with respective to the progress track's width and total duration
    static getProgressHeadDragPosition = (
        e: MouseEvent<HTMLDivElement>,
        progressBar: HTMLDivElement,
        progress: IPlayerControlsProps['progress'],
    ): { dragTime: number; dragPercentage: number } => {
        const dragPercentage = PlayerControlsService.getProgressHeadDragPercent(e, progressBar);
        const dragTime = (dragPercentage * progress.total) / 100;
        return { dragTime, dragPercentage };
    };

    // get current progress percentage
    static getProgressPercentage = (progress: IPlayerControlsProps['progress']): number => {
        const progressPercentage = progress.current / progress.total;
        return progressPercentage * 100;
    };
}
