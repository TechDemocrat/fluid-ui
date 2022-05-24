import { IContentActionGroupOptions } from '../ContentActionGroup/ContentActionGroup.types';

export interface IPhotoViewerSource {
    src: string;
    type: string;
    title: string;
}

export interface IPhotoViewerProps {
    /**
     * overall title for the current Photo viewer instance
     */
    title: string;

    /**
     * array of sources for the current Photo viewer instance
     */
    source: IPhotoViewerSource[];

    /**
     * pass needed actions in order for fullScreen action
     */
    actionGroupOptions: IContentActionGroupOptions;

    autoPlay?: boolean;
}
