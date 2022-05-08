import { Dispatch } from 'react';
import { TAccessibilityType } from '../VideoPlayer/components/PlayerAccesibilityLayer';

export interface IPlayerControlsProps {
    progress: {
        /**
         * in seconds
         */
        current: number;
        /**
         * in seconds
         */
        total: number;
        /**
         * in seconds
         */
        bufferedDuration: number;
        /**
         * in seconds
         */
        fastForwardBackwardSpeed: number;
        /**
         * newTime will be in seconds
         */
        onProgressChange: (newTime: number) => void;
        /**
         * Triggered when user dragges the progress bar
         */
        onProgressDragStart: () => void;
        /**
         * Triggered when user stops dragging the progress bar
         */
        onProgressDragEnd: () => void;
    };
    playPause: {
        isPlaying: boolean;
        onClick: () => void;
        isDisabled?: boolean;
    };
    next: {
        onClick: () => void;
        isDisabled?: boolean;
    };
    previous: {
        onClick: () => void;
        isDisabled?: boolean;
    };
    volume: {
        /**
         * in percentage scale of 100
         */
        currentLevel: number;
        /**
         * in percentage scale of 100
         * Used to set the volume level after unMute
         */
        previousLevel: number;
        isMuted: boolean;
        isDisabled?: boolean;
        /**
         * newLevel will be in percentage scale of 100
         */
        onChange: (newLevel: number) => void;
        onMute: () => void;
        onUnMute: () => void;
    };
    repeat: {
        mode: 'single' | 'all' | 'off';
        onClick: (mode: IPlayerControlsProps['repeat']['mode']) => void;
        isDisabled?: boolean;
    };
    shuffle: {
        isShuffled: boolean;
        onClick: () => void;
        isDisabled?: boolean;
    };
    captions: {
        isCaptionsOn: boolean;
        onClick: () => void;
        isDisabled?: boolean;
    };
    fullScreen: {
        isFullScreen: boolean;
        onClick: () => void;
        isDisabled?: boolean;
    };
    settings: {
        isDisabled?: boolean;
    };
    /**
     * set accessiblity action type corresponding to the action provided in the player controls like play, pause, volume up / down / mute / seek
     */
    setAccessiblityActionType: Dispatch<TAccessibilityType>;
    className?: string;
}
