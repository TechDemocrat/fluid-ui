export type TUploadServiceQueue = string[];

export type TUploadProgressStatus = 'waiting' | 'uploading' | 'uploaded' | 'cancelled' | 'error';

export interface IUploadProgress {
    progress: number;
    status: TUploadProgressStatus;
    localUrl: string;
    total: number;
    current: number;
    remoteUrl?: string;
}

export type TUploadProgressSubscription = (progress: IUploadProgress) => void;

export interface IUploadserviceProgressMeta {
    file: File;
    current: number;
    total: number;
    status: TUploadProgressStatus;
    options: IUploadOptions;
    localUrl: string;
    /**
     * This will be set when an simulation is used,
     * particularly used for simulating the cancel upload to clearOut the interval
     *
     * string - subscription id
     */
    subscriptions: Map<string, TUploadProgressSubscription>;
    remoteUrl?: string;
    simulationId?: NodeJS.Timeout;
}

export type TUploadServiceProgressMetaMapping = Map<string, IUploadserviceProgressMeta>;

export interface IUploadOptions {
    url?: string;
    simulate?: boolean;
    simulateOptions?: {
        uploadRate?: number;
        uploadSpeed?: number;
    };
}
