import { IContentActionGroupOptions } from '../ContentActionGroup/ContentActionGroup.types';
import { IPlayerControlsProps } from '../PlayerControls/PlayerControls.types';

export interface IVideoPlayerProps {
    source: {
        src: string;
        type: string;
        title: string;
    };
    /**
     * pass needed actions in order for fullScreen action
     */
    actionGroupOptions: IContentActionGroupOptions;

    /**
     * A URL for an image to be shown while the video is downloading.
     * If this attribute isn't specified, nothing is displayed until the first frame is available,
     * then the first frame is shown as the poster frame.
     */
    poster?: string;
    autoPlay?: boolean;
}

export type TvolumeState = Pick<
    IPlayerControlsProps['volume'],
    'currentLevel' | 'previousLevel' | 'isMuted'
>;

export type TVolumeHandlerType = keyof Pick<
    IPlayerControlsProps['volume'],
    'onChange' | 'onMute' | 'onUnMute'
>;
