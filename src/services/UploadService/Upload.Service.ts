import { formKey } from '../../utilities';
import {
    IUploadFileBothResponse,
    IUploadFileInput,
    IUploadFileMonoResponse,
    IUploadFileMultiResponse,
    IUploadOptions,
    IUploadProgress,
    IUploadScopeStatusMetaMapping,
    IUploadScopeCompletionResponse,
    IUploadServiceProgressMeta,
    TUploadProgressStatus,
    TUploadProgressSubscription,
    TUploadRootScopeMapping,
    TUploadScopeMapping,
    TUploadServiceProgressMetaMapping,
    TUploadServiceQueue,
    TUploadScopeStatusType,
    TUploadGlobalScopeSubscriptionMapping,
} from './UploadService.types';

export class UploadService {
    private static instance: UploadService;

    private queue: TUploadServiceQueue;

    private progressMapping: TUploadServiceProgressMetaMapping;

    private globalScopeSubscriptionMapping: TUploadGlobalScopeSubscriptionMapping;

    private scopeMapping: TUploadScopeMapping;

    private rootScopeMapping: TUploadRootScopeMapping;

    private isQueueProcessing: boolean;

    constructor() {
        this.queue = [];
        this.scopeMapping = new Map();
        this.rootScopeMapping = new Map();
        this.progressMapping = new Map();
        this.globalScopeSubscriptionMapping = new Map();
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
            const subscriptionId = formKey(uploadId, formKey());
            uploadProgressMeta.subscriptions.set(subscriptionId, callback);
            callback(this.getUploadProgressMeta(uploadId)); // initial call
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

    /**
     *
     * @param scopeId - the id of the upload
     * @param type = type of the scope - for global scope scopeId is ignored
     * @param callback - the callback to be called when the upload is complete
     *
     * @returns a subscription id that can be used to unsubscribe, if passed id is not valid undefined will be returned
     */
    subscribeToScope = <
        T extends TUploadScopeStatusType,
        R extends IUploadScopeStatusMetaMapping[T],
    >(
        type: T,
        scopeId: string | undefined,
        callback: (data: R) => void,
    ): string | undefined => {
        const statusMeta = this.getScopeStatusMeta(type, scopeId) as R;
        if (statusMeta) {
            const subscriptionId = formKey(scopeId ?? '', formKey());
            if (type === 'scope') {
                this.scopeMapping
                    .get(scopeId ?? '')
                    ?.subscriptions.set(subscriptionId, (data) => callback(data as R));
            } else if (type === 'rootScope') {
                this.rootScopeMapping
                    .get(scopeId ?? '')
                    ?.subscriptions.set(subscriptionId, (data) => callback(data as R));
            } else if (type === 'global') {
                this.globalScopeSubscriptionMapping.set(subscriptionId, (data) =>
                    callback(data as R),
                );
            }
            callback(statusMeta); // initial call
            return subscriptionId;
        }
        return undefined;
    };

    unsubscribeFromScope = (
        type: TUploadScopeStatusType,
        subscriptionId: string,
        scopeId?: string,
    ) => {
        if (type === 'scope') {
            this.scopeMapping.get(scopeId ?? '')?.subscriptions.delete(subscriptionId);
        } else if (type === 'rootScope') {
            this.rootScopeMapping.get(scopeId ?? '')?.subscriptions.delete(subscriptionId);
        } else if (type === 'global') {
            this.rootScopeMapping.delete(subscriptionId);
        }
    };

    getUploadProgressMeta = (uploadId: string): IUploadProgress => {
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

    getScopeStatusMeta = <
        T extends TUploadScopeStatusType,
        R extends IUploadScopeStatusMetaMapping[T] | undefined,
    >(
        type: T,
        scopeId?: string,
    ): R => {
        let progressMeta: R;
        switch (type) {
            case 'global':
                progressMeta = this.rootScopeMapping.get(
                    [...this.rootScopeMapping.keys()][this.rootScopeMapping.size - 1],
                ) as R; // returns finally inserted map - Note: random meta will be returned since map is not indexed
                break;
            case 'rootScope':
                progressMeta = (scopeId ? this.rootScopeMapping.get(scopeId) : undefined) as R;
                break;
            case 'scope':
            default:
                progressMeta = (scopeId ? this.scopeMapping.get(scopeId) : undefined) as R;
                break;
        }

        return progressMeta;
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
                uploadScope.status = 'completed';
                options?.onAllUploadsDoneInCurrentScope?.(allUploadProgressMeta);
                this.broadcastToUploadScopeSubscriptions(scopeId);
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
                uploadRootScope.status = 'completed';
                options?.onAllUploadsDoneInRootScope?.(allUploadProgressMeta);
                this.broadcastToRootScopeSubscriptions(rootScopeId);
                this.broadcastToGlobalScopeSubscriptions(rootScopeId);
            }
        }
        return {
            completed: allScopeCompleted,
            uploadProgressMeta: allUploadProgressMeta,
        };
    };

    /**
     *
     * @param scopeId - id of the upload resource
     * @param type - if type not passed default will be 'instance'
     * @returns
     */
    checkIsValidScopeId = (type: TUploadScopeStatusType, scopeId?: string): boolean => {
        let isValid = false;
        switch (type) {
            case 'global':
                isValid = this.rootScopeMapping.size > 0;
                break;
            case 'rootScope':
                isValid = this.rootScopeMapping.has(scopeId ?? '');
                break;
            case 'scope':
            default:
                isValid = this.scopeMapping.has(scopeId ?? '');
                break;
        }

        return isValid;
    };

    private broadcastToUploadScopeSubscriptions = (uploadScopeId: string) => {
        const uploadScopeMeta = this.scopeMapping.get(uploadScopeId);
        if (uploadScopeMeta) {
            uploadScopeMeta.subscriptions.forEach((callback) => {
                callback(uploadScopeMeta);
            });
        }
    };

    private broadcastToRootScopeSubscriptions = (rootScopeId: string) => {
        const rootScopeMeta = this.rootScopeMapping.get(rootScopeId);
        if (rootScopeMeta) {
            rootScopeMeta.subscriptions.forEach((callback) => {
                callback(rootScopeMeta);
            });
        }
    };

    private broadcastToGlobalScopeSubscriptions = (rootScopeId: string) => {
        const rootScopeMeta = this.rootScopeMapping.get(rootScopeId);
        if (rootScopeMeta) {
            this.globalScopeSubscriptionMapping.forEach((callback) => {
                callback(rootScopeMeta);
            });
        }
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
            scope = {
                options,
                uploadId: [],
                isCallbackTriggered: false,
                status: 'in-progress',
                subscriptions: new Map(),
            };
            this.scopeMapping.set(scopeId, scope);
        }
        scope.uploadId.push(uploadId);
        scope.isCallbackTriggered = false;
        scope.status = 'in-progress';

        // root scop setting block
        let rootScope = this.rootScopeMapping.get(rootScopeId);
        if (!rootScope) {
            rootScope = {
                options,
                scopeIds: [],
                isCallbackTriggered: false,
                status: 'in-progress',
                subscriptions: new Map(),
            };
            this.rootScopeMapping.set(rootScopeId, rootScope);
        }
        rootScope.scopeIds.push(scopeId);
        rootScope.isCallbackTriggered = false;
        rootScope.status = 'in-progress';

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

    private broadcastToUploadProgressSubscriptions = (uploadId: string) => {
        const uploadProgressMeta = this.progressMapping.get(uploadId);
        if (uploadProgressMeta) {
            uploadProgressMeta.subscriptions.forEach((callback) =>
                callback(this.getUploadProgressMeta(uploadId)),
            );
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
                this.broadcastToUploadProgressSubscriptions(uploadId);
            }, uploadSpeed);
        }
    };
}
