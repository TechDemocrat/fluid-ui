import { formKey } from '../../utilities';
import {
    IUploadFileBothResponse,
    IUploadFileInput,
    IUploadFileMonoResponse,
    IUploadFileMultiResponse,
    IUploadOptions,
    IUploadProgress,
    IUploadServiceProgressMeta,
    TUploadProgressSubscription,
    TUploadScopeMapping,
    TUploadServiceProgressMetaMapping,
    TUploadServiceQueue,
} from './UploadService.types';

export class UploadService {
    private static instance: UploadService;

    private queue: TUploadServiceQueue;

    private progressMapping: TUploadServiceProgressMetaMapping;

    private scopeMapping: TUploadScopeMapping;

    private isQueueProcessing: boolean;

    constructor() {
        this.queue = [];
        this.scopeMapping = new Map();
        this.progressMapping = new Map();
        this.isQueueProcessing = false;
    }

    static getInstance() {
        if (!UploadService.instance) {
            UploadService.instance = new UploadService();
        }
        return UploadService.instance;
    }

    upload(files: IUploadFileInput, options: IUploadOptions): IUploadFileMonoResponse;
    upload(files: IUploadFileInput[], options: IUploadOptions): IUploadFileMultiResponse;
    upload(
        files: IUploadFileInput | IUploadFileInput[],
        options: IUploadOptions,
    ): IUploadFileBothResponse {
        const currentScopeId = options?.scopeId ?? formKey();

        const isFilesArray = Array.isArray(files);

        if (isFilesArray) {
            const uploadId = files.map((currentFile) =>
                this.addToQueue(currentFile, options, currentScopeId),
            );
            return {
                scopeId: currentScopeId,
                uploadId,
            };
        }

        // single file upload
        const uploadId = this.addToQueue(files, options, currentScopeId);
        return { scopeId: currentScopeId, uploadId };
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
                fileName: uploadProgressMeta.fileInput.file.name,
                fileType: uploadProgressMeta.fileInput.file.type,
            };
            return progress;
        }
        return {} as IUploadProgress;
    };

    private addToQueue = (
        fileInput: IUploadFileInput,
        options: IUploadOptions,
        scopeId: string,
    ): string => {
        const uploadId = fileInput?.customId ?? formKey();
        const uploadProgressMeta: IUploadServiceProgressMeta = {
            scopeId,
            uploadId,
            fileInput,
            fileType: fileInput.file.type,
            current: 0,
            total: fileInput.file.size,
            url: URL.createObjectURL(fileInput.file),
            status: 'waiting',
            options,
            subscriptions: new Map(),
        };
        this.progressMapping.set(uploadId, uploadProgressMeta);
        this.queue.push(uploadId);
        if (!this.scopeMapping.has(scopeId)) {
            this.scopeMapping.set(scopeId, { options, uploadId: [] });
        }
        this.scopeMapping.get(scopeId)?.uploadId.push(uploadId);
        this.processQueue();
        return uploadId;
    };

    private processQueue = async () => {
        if (this.isQueueProcessing || this.queue.length === 0) {
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
                // TODO: actual upload flow
                // wire it up with upload handler from client
            }
        }
    };

    private checkAndNotifyIfAllUPloadInScopeCompleted = (scopeId: string) => {
        const uploadScope = this.scopeMapping.get(scopeId);
        if (uploadScope) {
            const { options, uploadId } = uploadScope;
            const allUploadProgressMeta: IUploadServiceProgressMeta[] = [];
            const allCompleted = uploadId.every((currentUploadId) => {
                const uploadProgressMeta = this.progressMapping.get(currentUploadId);
                allUploadProgressMeta.push(uploadProgressMeta as IUploadServiceProgressMeta);
                return uploadProgressMeta?.status === 'uploaded';
            });
            if (allCompleted) {
                options?.onAllUploadDone?.(allUploadProgressMeta);
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
                    uploadProgressMeta.fileInput.onUploadDone?.(uploadProgressMeta);
                    this.checkAndNotifyIfAllUPloadInScopeCompleted(uploadProgressMeta.scopeId);
                }
                uploadProgressMeta.subscriptions.forEach((callback) =>
                    callback(this.getUploadProgressData(uploadId)),
                );
            }, uploadSpeed);
        }
    };
}
