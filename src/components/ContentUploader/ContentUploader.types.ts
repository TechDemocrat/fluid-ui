import { ReactNode } from 'react';

export type TContentUploadStatus = 'idle' | 'uploading' | 'uploaded';
export type TAllowedFileTypes = 'mp4' | 'webm' | 'ogg' | 'mp3' | 'wav';

export interface IContentUploaderProps {
    label: string;
    status: TContentUploadStatus;
    onUpload?: (file: File) => void;
    uploadProgress?: {
        /**
         * value should be specified in bytes
         */
        loaded: number;
        /**
         * value should be specified in bytes
         */
        total: number;
    };
    onUploadCancel?: () => void;
    allowedFileTypes?: TAllowedFileTypes[];
    /**
     * should be passed if staus is 'uploaded'
     */
    uploadedContentDisplay?: ReactNode;
}
