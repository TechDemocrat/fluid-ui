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
    /**
     * if rootScopeId is not passed by the consumer, scopeId will be rootScopeId
     * rootScopeId is used to batch **set of batched uploads** together
     */
    rootScopeId: string;
    uploadId: string;
};

export type IUploadFileMultiResponse = {
    /**
     * for single file the uploadId is same as the scopeId
     * scopeId is used to batch **set of uploads** together
     */
    scopeId: string;
    /**
     * if rootScopeId is not passed by the consumer, scopeId will be rootScopeId
     * rootScopeId is used to batch **set of batched uploads** together
     */
    rootScopeId: string;
    uploadId: string[];
};

export type IUploadFileBothResponse = IUploadFileMonoResponse | IUploadFileMultiResponse;

export interface IUploadFileInput {
    file: File;
    /**
     * if passed uploadId will be used instead of generating one
     */
    uploadId?: string;
    /**
     * triggers on upload done
     */
    onUploadDone?: (uploadProgressMeta: IUploadServiceProgressMeta) => void;
}

export interface IUploadServiceProgressMeta extends IUploadFileMonoResponse {
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

export interface IUploadScope {
    uploadId: string[];
    options: IUploadOptions;
    /**
     * Flag is used to call the scope upload completion callback only once
     */
    isCallbackTriggered?: boolean;
}

/**
 * key - scopeId
 * value - uploadId
 */
export type TUploadScopeMapping = Map<string, IUploadScope>;

export interface IRootScope {
    scopeIds: string[];
    /**
     * only first set option will be considered
     */
    options: IUploadOptions;
    /**
     * Flag is used to call the scope upload completion callback only once
     */
    isCallbackTriggered?: boolean;
}

/**
 * key - rootScopeId
 * value - scopeId
 */
export type TUploadRootScopeMapping = Map<string, IRootScope>;

export interface IUploadOptions {
    url?: string;
    /**
     * if passed scopeId will be used instead of generating one
     *
     * this is used to group uploads together on the single request
     */
    scopeId?: string;
    /**
     * if rootScopeId is not passed by the consumer, scopeId will be rootScopeId
     * rootScopeId is used to batch **set of batched uploads** together
     */
    rootScopeId?: string;
    /**
     * will be triggered when the upload is complete, useful when upload runs in the background
     * and you want to let the server know when it is done
     */
    onAllUploadsDoneInCurrentScope?: (uploadProgressMeta: IUploadServiceProgressMeta[]) => void;
    /**
     * will be triggered when the upload is complete, useful when upload runs in the background
     * and you want to let the server know when it is done
     */
    onAllUploadsDoneInRootScope?: (uploadProgressMeta: IUploadServiceProgressMeta[]) => void;
    /**
     * if passed upload simulation will happen instead of actual upload
     */
    simulate?: boolean;
    simulateOptions?: {
        uploadRate?: number;
        uploadSpeed?: number;
    };
}

export interface IUploadScopeCompletionResponse {
    completed: boolean;
    uploadProgressMeta: IUploadServiceProgressMeta[];
}
