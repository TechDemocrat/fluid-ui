import { CSSProperties } from 'react';

export type TContentUploadStatus = 'idle' | 'filled';
export type TAllowedFileTypes = 'image/*' | 'image/jpeg' | 'image/png';
export type TImageUploadStatus = 'uploading' | 'done';

export interface IContentSource {
    id: string;
    location: 'local' | 'remote';
    status: 'uploading' | 'uploaded';
    type: string;
    /**
     * will be formed dynamically by the server using the id and persistence volume token
     *
     * for local storage, the blob url will be formed using the id and file object
     */
    src?: string;
}

export interface IImageUploaderProps {
    /**
     * label of the field to be displayed (video/Music/Podcast...)
     */
    label: string;
    /**
     * should be passed when the status is 'uploading'
     */
    contents: IContentSource[];
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
     * this gives the users the feedback while fetching upload id from server
     * this helps in avoiding unresponsiveness while contacting server
     */
    isPreparingToUpload?: boolean;
    /**
     * on file add catch the file and tweak the status to uploading if it is valid
     * if type is not supported through error toast from the parent component itself.
     */
    onUpload?: (file: File[]) => void;
    /**
     * on file add catch the file and tweak the status to uploading if it is valid
     * if type is not supported through error toast from the parent component itself.
     */
    onDelete?: (content: IContentSource) => void;
    /**
     * Triggers when edit icon is clicked - useful when used along with view mode 'view'
     */
    onEdit?: () => void;
    /**
     * Triggers when delete icon is clicked - handle delete all flow in the parent
     */
    onDeleteAll?: () => void;
}

export interface IUploaderErrorMessage {
    enabled: boolean;
    message: string;
}
