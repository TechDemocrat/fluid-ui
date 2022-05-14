import { IContentActionGroupOptions } from '../ContentActionGroup/ContentActionGroup.types';

export interface IAudioPlayerProps {
    source: {
        src: string;
        type: string;
        title: string;
        /**
         * A URL for an image to be shown while the Audio is downloading.
         * If this attribute isn't specified, nothing is displayed until the first frame is available,
         * then the first frame is shown as the poster frame.
         */
        poster: string;
    };
    /**
     * pass needed actions in order for fullScreen action
     */
    actionGroupOptions: IContentActionGroupOptions;

    autoPlay?: boolean;
}
