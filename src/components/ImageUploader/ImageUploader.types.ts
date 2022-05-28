export type TContentUploadStatus = 'idle' | 'filled';
export type TAllowedFileTypes = 'image/*' | 'image/jpeg' | 'image/png';
export type TImageUploadStatus = 'uploading' | 'done';

export interface IImageUploaderContent {
    /**
     * timestamp will be added as id
     **/
    id: string;
    url: string;
    /**
     * uploaded at timestamp
     */
    uploadedAt?: string;
    /**
     * upload progress
     */
    progress?: {
        status: TImageUploadStatus;
        loaded: number;
        total: number;
        file: File;
    };
}

export interface IImageUploaderProps {
    /**
     * label of the field to be displayed (video/Music/Podcast...)
     */
    label: string;
    /**
     * should be passed when the status is 'uploading'
     */
    content: IImageUploaderContent[];
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
     * if enabled multile uploads are allowed
     */
    allowMultiple?: boolean;
    /**
     * pass allowed file types as an array of strings (to allow from input field)
     */
    allowedFileTypes?: TAllowedFileTypes[];
    /**
     * on file add catch the file and tweak the status to uploading if it is valid
     * if type is not supported throught error toast from the parent component itself.
     */
    onUpload?: (file: File[]) => void;
    /**
     * on file add catch the file and tweak the status to uploading if it is valid
     * if type is not supported throught error toast from the parent component itself.
     */
    onDelete?: (id: string) => void;
}

export interface IUploaderErrorMessage {
    enabled: boolean;
    message: string;
}
