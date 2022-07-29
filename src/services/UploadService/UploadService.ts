import { uniqueId } from 'lodash';
import {
    IUploadOptions,
    IUploadProgress,
    IUploadServiceProgressMeta,
    TUploadProgressSubscription,
    TUploadServiceProgressMetaMapping,
    TUploadServiceQueue,
} from './UploadService.types';

export class UploadService {
    private static instance: UploadService;

    private queue: TUploadServiceQueue;

    private progressMapping: TUploadServiceProgressMetaMapping;

    private isQueueProcessing: boolean;

    constructor() {
        this.queue = [];
        this.progressMapping = new Map();
        this.isQueueProcessing = false;
    }

    static getInstance() {
        if (!UploadService.instance) {
            UploadService.instance = new UploadService();
        }
        return UploadService.instance;
    }

    upload(file: File, options: IUploadOptions): string;
    upload(file: File[], options: IUploadOptions): string[];
    upload(file: File | File[], options: IUploadOptions): string | string[] {
        if (Array.isArray(file)) {
            return file.map((currentFile) => this.addToQueue(currentFile, options));
        }
        return this.addToQueue(file, options);
    }

    cancelUpload = (uploadId: string) => {
        const uploadProgressMeta = this.progressMapping.get(uploadId);
        if (uploadProgressMeta) {
            uploadProgressMeta.status = 'cancelled';
            if (uploadProgressMeta.options.simulate) {
                clearInterval(uploadProgressMeta.simulationId);
            } else {
                // actual upload flow - hold for now
                // wire it up with axios cancel
            }
        }
    };

    /**
     *
     * @param uploadId - the id of the upload
     * @param callback - the callback to be called when the upload is complete
     *
     * @returns a subscription id that can be used to unsubscribe
     */
    subscribe = (uploadId: string, callback: TUploadProgressSubscription): string => {
        const uploadProgressMeta = this.progressMapping.get(uploadId);
        if (uploadProgressMeta) {
            const subscriptionId = `${uploadId}-${Math.random()}`;
            uploadProgressMeta.subscriptions.set(subscriptionId, callback);
            callback(this.getUploadProgressData(uploadId)); // initial call
            return subscriptionId;
        }
        return '';
    };

    unsubscribe = (uploadId: string, subscriptionId: string) => {
        const uploadProgressMeta = this.progressMapping.get(uploadId);
        if (uploadProgressMeta) {
            uploadProgressMeta.subscriptions.delete(subscriptionId);
        }
    };

    getUploadProgressData = (uploadId: string): IUploadProgress => {
        const uploadProgressMeta = this.progressMapping.get(uploadId);
        if (uploadProgressMeta) {
            // progress percentage in range [0, 100]
            const progressPercentage = Math.round(
                (uploadProgressMeta.current / uploadProgressMeta.total) * 100,
            );
            const progress: IUploadProgress = {
                current: uploadProgressMeta.current,
                progress: progressPercentage,
                status: uploadProgressMeta.status,
                total: uploadProgressMeta.total,
                url: uploadProgressMeta.url,
            };
            return progress;
        }
        return {} as IUploadProgress;
    };

    private addToQueue = (file: File, options: IUploadOptions): string => {
        const uploadId = uniqueId();
        const uploadProgressMeta: IUploadServiceProgressMeta = {
            file,
            current: 0,
            total: file.size,
            url: URL.createObjectURL(file),
            status: 'waiting',
            options,
            subscriptions: new Map(),
        };
        this.progressMapping.set(uploadId, uploadProgressMeta);
        this.queue.push(uploadId);
        this.processQueue();
        return uploadId;
    };

    private processQueue = async () => {
        if (this.isQueueProcessing) {
            return;
        }
        if (this.queue.length === 0) {
            return;
        }
        this.isQueueProcessing = true;
        while (this.queue.length > 0) {
            const uploadId = this.queue.shift();
            if (uploadId) {
                this.initiateUpload(uploadId);
            }
        }
        this.isQueueProcessing = false;
    };

    private initiateUpload = async (uploadId: string) => {
        const uploadProgressMeta = this.progressMapping.get(uploadId);
        if (uploadProgressMeta) {
            uploadProgressMeta.status = 'uploading';
            if (uploadProgressMeta.options.simulate) {
                this.simulateUpload(uploadId);
            } else {
                // actual upload flow - hold for now
                // wire it up with axios
            }
        }
    };

    private simulateUpload = async (uploadId: string) => {
        const uploadProgressMeta = this.progressMapping.get(uploadId);
        if (uploadProgressMeta) {
            const uploadSpeed = uploadProgressMeta.options.simulateOptions?.uploadSpeed || 100;
            const uploadRate = uploadProgressMeta.options.simulateOptions?.uploadRate || 10000;

            uploadProgressMeta.simulationId = setInterval(() => {
                if (uploadProgressMeta.current < uploadProgressMeta.total) {
                    uploadProgressMeta.current += uploadRate;
                } else {
                    clearInterval(uploadProgressMeta.simulationId);
                    uploadProgressMeta.status = 'uploaded';
                }
                uploadProgressMeta.subscriptions.forEach((callback) =>
                    callback(this.getUploadProgressData(uploadId)),
                );
            }, uploadSpeed);
        }
    };
}
