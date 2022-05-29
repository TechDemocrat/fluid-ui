import { useEffect, useMemo, useState } from 'react';
import { UploadService } from '../../services/UploadService/UploadService';
import { IUploadProgress } from '../../services/UploadService/UploadService.types';

export const useUploadProgress = (uploadId: string | undefined): IUploadProgress | undefined => {
    // refs
    const uploadService = useMemo(() => UploadService.getInstance(), []);

    // state
    const initialState = useMemo(
        () => (uploadId ? uploadService.getUploadProgressData(uploadId) : ({} as IUploadProgress)),
        [uploadId, uploadService],
    );
    const [progress, setProgress] = useState<IUploadProgress>(initialState);

    // effects
    useEffect(() => {
        let subscriptionId: string;
        if (uploadId !== undefined) {
            subscriptionId = uploadService.subscribe(uploadId, (currentProgress) => {
                setProgress(currentProgress);
            });
        }
        return () => {
            if (uploadId !== undefined) {
                uploadService.unsubscribe(uploadId, subscriptionId);
            }
        };
    }, [uploadId, uploadService]);

    return uploadId ? progress : undefined;
};
