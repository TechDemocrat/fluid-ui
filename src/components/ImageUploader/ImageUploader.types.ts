import { CSSProperties } from 'react';

export type TContentUploadStatus = 'idle' | 'filled';
export type TAllowedFileTypes = 'image/*' | 'image/jpeg' | 'image/png';
export type TImageUploadStatus = 'uploading' | 'done';

export interface IImageUploaderContent {
    /**
     * local is when the image uploader uploads the image to the server
     * remote is when the image uploader gets the image from the server
     *
     * if type is local, progressId should be set to the id of the upload
     */
    type: 'remote' | 'local';
    /**
     * remote id is the id of the image on the server
     * used to delete the image from the server
     **/
    id: string;
    url?: string;
}

export interface IImageUploaderProps {
    /**
     * label of the field to be displayed (video/Music/Podcast...)
     */
    label: string;
    /**
     * should be passed when the status is 'uploading'
     */
    contents: IImageUploaderContent[];
    /**
     * view mode
     */
    viewMode: 'view' | 'edit';
    /**
     * show edit icon
     * @default false
     */
    showEditIcon?: boolean;
    /**
     * width of the container
     */
    width?: CSSProperties['width'];
    /**
     * height of the container
     */
    height?: CSSProperties['height'];
    /**
     * if enabled multiple uploads are allowed
     */
    allowMultiple?: boolean;
    /**
     * pass allowed file types as an array of strings (to allow from input field)
     */
    allowedFileTypes?: TAllowedFileTypes[];
    /**
     * on file add catch the file and tweak the status to uploading if it is valid
     * if type is not supported through error toast from the parent component itself.
     */
    onUpload?: (file: File[]) => void;
    /**
     * on file add catch the file and tweak the status to uploading if it is valid
     * if type is not supported through error toast from the parent component itself.
     */
    onDelete?: (content: IImageUploaderContent) => void;
}

export interface IUploaderErrorMessage {
    enabled: boolean;
    message: string;
}
