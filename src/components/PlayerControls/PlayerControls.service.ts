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
            progress: { current: 0, total: 0, fastForwardBackwardSpeed: 10 },
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
        return percent;
    };

    static getProgressHoverTime = (e: MouseEvent<HTMLDivElement>, duration: number): number => {
        const percent = PlayerControlsService.getProgressHoverPercent(e);
        const time = percent * duration;
        return time;
    };

    static getProgressHoverTimeString = (
        e: MouseEvent<HTMLDivElement>,
        duration: number,
    ): string => {
        const time = PlayerControlsService.getProgressHoverTime(e, duration);
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
    ): { total: string; current: string } => {
        const total = PlayerControlsService.getTimeString(progress.total);
        const current = PlayerControlsService.getTimeString(progress.current);
        return { total, current };
    };
}
