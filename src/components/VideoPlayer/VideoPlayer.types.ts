import { IPlayerControlsProps } from '../PlayerControls/PlayerControls.types';

export interface IVideoPlayerProps {
    source: {
        src: string;
        type: string;
    };
    autoPlay: boolean;
    /**
     * A URL for an image to be shown while the video is downloading.
     * If this attribute isn't specified, nothing is displayed until the first frame is available,
     * then the first frame is shown as the poster frame.
     */
    poster: string;
}

export type TvolumeState = Pick<
    IPlayerControlsProps['volume'],
    'currentLevel' | 'previousLevel' | 'isMuted'
>;
