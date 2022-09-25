import { formKey } from '../../utilities';
import {
    IUploadFileBothResponse,
    IUploadFileInput,
    IUploadFileMonoResponse,
    IUploadFileMultiResponse,
    IUploadOptions,
    IUploadProgress,
    IUploadScopeCompletionResponse,
    IUploadServiceProgressMeta,
    TUploadProgressStatus,
    TUploadProgressSubscription,
    TUploadRootScopeMapping,
    TUploadScopeMapping,
    TUploadServiceProgressMetaMapping,
    TUploadServiceQueue,
} from './UploadService.types';

export class UploadService {
    private static instance: UploadService;

    private queue: TUploadServiceQueue;

    private progressMapping: TUploadServiceProgressMetaMapping;

    private scopeMapping: TUploadScopeMapping;

    private rootScopeMapping: TUploadRootScopeMapping;

    private isQueueProcessing: boolean;

    constructor() {
        this.queue = [];
        this.scopeMapping = new Map();
        this.rootScopeMapping = new Map();
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
        const currentRootScopeId = options?.rootScopeId ?? currentScopeId;

        const isFilesArray = Array.isArray(files);

        if (isFilesArray) {
            const uploadId = files.map((currentFile) =>
                this.addToQueue(currentFile, options, currentScopeId, currentRootScopeId),
            );
            return {
                scopeId: currentScopeId,
                rootScopeId: currentRootScopeId,
                uploadId,
            };
        }

        // single file upload
        const uploadId = this.addToQueue(files, options, currentScopeId, currentRootScopeId);
        return { scopeId: currentScopeId, rootScopeId: currentRootScopeId, uploadId };
    }

    cancelUpload = (...uploadIds: string[]) => {
        uploadIds.forEach((uploadId) => {
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
        });
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

    checkIsAllUploadsInScopeCompleted = (
        scopeId: string,
        shouldTriggerCallback = true,
    ): IUploadScopeCompletionResponse => {
        const uploadScope = this.scopeMapping.get(scopeId);
        let completed = false;
        const allUploadProgressMeta: IUploadServiceProgressMeta[] = [];
        if (uploadScope) {
            const { options, uploadId } = uploadScope;
            completed = uploadId.every((currentUploadId) => {
                const uploadProgressMeta = this.progressMapping.get(currentUploadId);
                allUploadProgressMeta.push(uploadProgressMeta as IUploadServiceProgressMeta);
                // error from check array if fails in any edge cases
                return (['uploaded', 'cancelled', 'error'] as TUploadProgressStatus[]).includes(
                    uploadProgressMeta?.status ?? 'uploaded',
                );
            });
            if (completed && shouldTriggerCallback && !uploadScope.isCallbackTriggered) {
                uploadScope.isCallbackTriggered = true; // this ensures triggering callback only once
                options?.onAllUploadsDoneInCurrentScope?.(allUploadProgressMeta);
            }
        }
        return { completed, uploadProgressMeta: allUploadProgressMeta };
    };

    checkIsAllUploadsInRootScopeCompleted = (
        rootScopeId: string,
    ): IUploadScopeCompletionResponse => {
        const uploadRootScope = this.rootScopeMapping.get(rootScopeId);
        let allScopeCompleted = false;
        const allUploadProgressMeta: IUploadServiceProgressMeta[] = [];
        if (uploadRootScope) {
            const { scopeIds, options } = uploadRootScope;
            allScopeCompleted = scopeIds.every((currentScopeId) => {
                const { completed: allCompleted, uploadProgressMeta } =
                    this.checkIsAllUploadsInScopeCompleted(currentScopeId, false);
                allUploadProgressMeta.push(...uploadProgressMeta);
                return allCompleted;
            });
            if (allScopeCompleted && !uploadRootScope.isCallbackTriggered) {
                uploadRootScope.isCallbackTriggered = true; // this ensures triggering callback only once
                options?.onAllUploadsDoneInRootScope?.(allUploadProgressMeta);
            }
        }
        return {
            completed: allScopeCompleted,
            uploadProgressMeta: allUploadProgressMeta,
        };
    };

    private addToQueue = (
        fileInput: IUploadFileInput,
        options: IUploadOptions,
        scopeId: string,
        rootScopeId: string,
    ): string => {
        const uploadId = fileInput?.uploadId ?? formKey();
        const uploadProgressMeta: IUploadServiceProgressMeta = {
            rootScopeId,
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

        // scope setting block
        let scope = this.scopeMapping.get(scopeId);
        if (!scope) {
            scope = { options, uploadId: [], isCallbackTriggered: false };
            this.scopeMapping.set(scopeId, scope);
        }
        scope.uploadId.push(uploadId);
        scope.isCallbackTriggered = false;

        // root scop setting block
        let rootScope = this.rootScopeMapping.get(rootScopeId);
        if (!rootScope) {
            rootScope = {
                options,
                scopeIds: [],
                isCallbackTriggered: false,
            };
            this.rootScopeMapping.set(rootScopeId, rootScope);
        }
        rootScope.scopeIds.push(scopeId);
        rootScope.isCallbackTriggered = false;

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
                    if (uploadProgressMeta.status === 'uploading') {
                        uploadProgressMeta.status = 'uploaded';
                        uploadProgressMeta.fileInput.onUploadDone?.(uploadProgressMeta);
                        this.checkIsAllUploadsInScopeCompleted(uploadProgressMeta.scopeId);
                        this.checkIsAllUploadsInRootScopeCompleted(uploadProgressMeta.rootScopeId);
                    }
                }
                uploadProgressMeta.subscriptions.forEach((callback) =>
                    callback(this.getUploadProgressData(uploadId)),
                );
            }, uploadSpeed);
        }
    };
}
