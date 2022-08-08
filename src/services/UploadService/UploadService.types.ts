export type TUploadServiceQueue = string[];

export type TUploadProgressStatus = 'waiting' | 'uploading' | 'uploaded' | 'cancelled' | 'error';

export interface IUploadProgress {
    progress: number;
    status: TUploadProgressStatus;
    url: string;
    total: number;
    current: number;
    fileName: string;
    fileType: string;
}

export type TUploadProgressSubscription = (progress: IUploadProgress) => void;

export interface IUploadServiceProgressMeta {
    file: File;
    current: number;
    total: number;
    status: TUploadProgressStatus;
    options: IUploadOptions;
    url: string;
    /**
     * This will be set when an simulation is used,
     * particularly used for simulating the cancel upload to clearOut the interval
     *
     * string - subscription id
     */
    subscriptions: Map<string, TUploadProgressSubscription>;
    simulationId?: NodeJS.Timeout;
}

export type TUploadServiceProgressMetaMapping = Map<string, IUploadServiceProgressMeta>;

export interface IUploadOptions {
    url?: string;
    /**
     * if passed customId will be used instead of generating one
     */
    customId?: string;
    /**
     * will be triggered when the upload is complete, useful when upload runs in the background
     * and you want to let the server know when it is done
     */
    onUploadDone?: () => void;
    /**
     * will be triggered when the upload is cancelled, useful when upload runs in the background
     * and you want to clear out the footprint of the upload
     */
    onUploadError?: () => void;
    simulate?: boolean;
    simulateOptions?: {
        uploadRate?: number;
        uploadSpeed?: number;
    };
}
