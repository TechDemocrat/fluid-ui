import { ReactNode } from 'react';

export type TContentUploadStatus = 'idle' | 'uploading' | 'uploaded';
export type TAllowedFileTypes = 'image/*' | 'image/jpeg' | 'image/png';

export interface IUploadProgress {
    /**
     * on file selection send back the upload file name from parent component
     */
    fileName?: string;
    /**
     * value should be specified in bytes
     */
    loaded: number;
    /**
     * value should be specified in bytes
     */
    total: number;
    /**
     * on upload cancel handler
     */
    onCancel?: () => void;
}

export interface IUploadContentMeta {
    /**
     * should be passed if staus is 'uploaded'
     */
    previewArea?: ReactNode;
    /**
     * uploaded at timestamp
     */
    uploadedAt?: string;
    /**
     * on delet handler
     */
    onDelete?: () => void;
}

export interface IImageUploaderProps {
    /**
     * label of the field to be displayed (video/Music/Podcast...)
     */
    label: string;
    /**
     * status of the uploader - initially at 'idle'
     */
    status: TContentUploadStatus;
    /**
     * pass allowed file types as an array of strings (to allow from input field)
     */
    allowedFileTypes?: TAllowedFileTypes[];
    /**
     * on file add catch the file and tweak the status to uploading if it is valid
     * if type is not supported throught error toast from the parent component itself.
     */
    onUpload?: (file: File) => void;
    /**
     * should be passed when the status is 'uploading'
     */
    uploadProgress?: IUploadProgress;
    /**
     * should be passed when the status is 'uploaded'
     */
    uploadedContentMeta?: IUploadContentMeta;
}
