import { CSSProperties, ReactNode } from 'react';
import { IContentSource } from '../ImageUploader/ImageUploader.types';

export type TContentUploadStatus = 'idle' | 'uploading' | 'uploaded' | 'preparing';
export type TAllowedFileTypes =
    | 'video/*'
    | 'audio/*'
    | 'video/mp4'
    | 'video/webm'
    | 'video/ogg'
    | 'video/quicktime'
    | 'video/x-flv'
    | 'audio/mp3'
    | 'audio/webm'
    | 'audio/ogg'
    | 'audio/mpeg'
    | 'audio/mp4'
    | 'audio/x-m4a'
    | 'audio/x-aac'
    | 'audio/aac';

export interface IUploadContentMeta {
    /**
     * should be passed if status is 'uploaded'
     */
    previewArea?: () => ReactNode;
    /**
     * uploaded at timestamp
     */
    uploadedAt?: string;
    /**
     * on delete handler
     */
    onDelete?: () => void;
}

export interface IContentUploaderProps {
    /**
     * label of the field to be displayed (video/Music/Podcast...)
     */
    label: string;
    /**
     * status of the uploader - initially at 'idle'
     */
    status: TContentUploadStatus;
    /**
     * width of the container
     */
    width?: CSSProperties['width'];
    /**
     * height of the container
     */
    height?: CSSProperties['height'];
    /**
     * pass allowed file types as an array of strings (to allow from input field)
     */
    allowedFileTypes?: TAllowedFileTypes[];
    /**
     * on file add catch the file and tweak the status to uploading if it is valid
     * if type is not supported through error toast from the parent component itself.
     */
    onUpload?: (file: File) => void;

    /**
     * triggered when the upload is canceled
     */
    onUploadCancel?: () => void;

    /**
     * source of the content to be uploaded
     */
    contentSource: IContentSource;

    /**
     * should be passed when the status is 'uploaded'
     */
    uploadedContentMeta?: IUploadContentMeta;
}
