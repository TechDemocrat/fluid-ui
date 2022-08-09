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

export type IUploadFileMonoResponse = {
    /**
     * for single file the uploadId is same as the scopeId
     */
    scopeId: string;
    uploadId: string;
};

export type IUploadFileMultiResponse = {
    /**
     * for single file the uploadId is same as the scopeId
     */
    scopeId: string;
    uploadId: string[];
};

export type IUploadFileBothResponse = { scopeId: string; uploadId: string | string[] };

export interface IUploadFileInput {
    file: File;
    /**
     * if passed customId will be used instead of generating one
     */
    customId?: string;
    /**
     * triggers on upload done
     */
    onUploadDone?: (uploadProgressMeta: IUploadServiceProgressMeta) => void;
}

export interface IUploadServiceProgressMeta {
    scopeId: string;
    uploadId: string;
    fileType: string;
    fileInput: IUploadFileInput;
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
    /**
     * Not for outer use, used inside service for tracking progress
     */
    simulationId?: NodeJS.Timeout;
}

export type TUploadServiceProgressMetaMapping = Map<string, IUploadServiceProgressMeta>;

/**
 * key - scopeId
 * value - uploadId
 */
export type TUploadScopeMapping = Map<string, { options: IUploadOptions; uploadId: string[] }>;

export interface IUploadOptions {
    url?: string;
    /**
     * if passed scopeId will be used instead of generating one
     *
     * this is used to group uploads together on the single request
     */
    scopeId?: string;
    /**
     * will be triggered when the upload is complete, useful when upload runs in the background
     * and you want to let the server know when it is done
     */
    onAllUploadDone?: (uploadProgressMeta: IUploadServiceProgressMeta[]) => void;
    /**
     * if passed upload simulation will happen instead of actual upload
     */
    simulate?: boolean;
    simulateOptions?: {
        uploadRate?: number;
        uploadSpeed?: number;
    };
}
