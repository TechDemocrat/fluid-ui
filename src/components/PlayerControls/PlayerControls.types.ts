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
        fastForwardBackwardSpeed: number;
        /**
         * newTime will be in seconds
         */
        onProgressChange?: (newTime: number) => void;
    };
    playPause: {
        isPlaying: boolean;
        onClick?: () => void;
        isDisabled?: boolean;
    };
    next: {
        onClick?: () => void;
        isDisabled?: boolean;
    };
    previous: {
        onClick?: () => void;
        isDisabled?: boolean;
    };
    volume: {
        /**
         * in percentage scale of 100
         */
        currentLevel: number;
        isMuted: boolean;
        onChange?: (newLevel: number) => void;
        isDisabled?: boolean;
    };
    repeat: {
        mode: 'single' | 'all' | 'off';
        onClick?: (mode: IPlayerControlsProps['repeat']['mode']) => void;
        isDisabled?: boolean;
    };
    shuffle: {
        isShuffled: boolean;
        onClick?: () => void;
        isDisabled?: boolean;
    };
    captions: {
        isCaptionsOn: boolean;
        onClick?: () => void;
        isDisabled?: boolean;
    };
    fullscreen: {
        isFullscreen: boolean;
        onClick?: () => void;
        isDisabled?: boolean;
    };
    settings: {
        isDisabled?: boolean;
    };
}
