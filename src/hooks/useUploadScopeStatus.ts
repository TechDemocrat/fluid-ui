import { cloneDeep } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { UploadService } from '../services/UploadService/Upload.Service';
import {
    IUploadScopeStatusMetaMapping,
    TUploadScopeStatusType,
} from '../services/UploadService/UploadService.types';
/**
 *
 * @param scopeId - upload id / scope id / root scope id
 * @returns the meta once the intended id has change in status
 */
export const useUploadScopeStatus = <
    T extends TUploadScopeStatusType,
    R extends IUploadScopeStatusMetaMapping[T] | undefined,
>(
    type: T,
    scopeId?: string,
): R => {
    // refs
    const uploadService = useMemo(() => UploadService.getInstance(), []);

    // handlers
    const isValidId = uploadService.checkIsValidScopeId(type, scopeId);

    const initialState = useMemo<R>(() => {
        return uploadService.getScopeStatusMeta(type, scopeId) as R;
    }, [type, scopeId, uploadService]);

    // state
    const [scopeStatus, setScopeStatus] = useState<R>(initialState);

    // effects
    useEffect(() => {
        let subscriptionId: string | undefined;
        if (isValidId) {
            subscriptionId = uploadService.subscribeToScope(type, scopeId, (currentStatus) => {
                setScopeStatus(cloneDeep(currentStatus) as R);
            });
        }
        return () => {
            if (subscriptionId) {
                uploadService.unsubscribeFromScope(type, subscriptionId, scopeId);
            }
        };
    }, [scopeId, isValidId, type, uploadService]);

    return isValidId ? scopeStatus : (undefined as R);
};
