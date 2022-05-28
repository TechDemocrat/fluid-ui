import { useEffect, useMemo, useState } from 'react';
import { UploadService } from '../../services/UploadService/UploadService';
import { IUploadProgress } from '../../services/UploadService/UploadService.types';

export const useUploadProgress = (uploadId: string): IUploadProgress => {
    // refs
    const uploadService = useMemo(() => UploadService.getInstance(), []);

    // state
    const [progress, setProgress] = useState<IUploadProgress>(
        uploadService.getUploadProgressData(uploadId),
    );

    // effects
    useEffect(() => {
        const subscriptionId = uploadService.subscribe(uploadId, (currentProgress) => {
            setProgress(currentProgress);
        });
        return () => {
            uploadService.unsubscribe(uploadId, subscriptionId);
        };
    }, [uploadId, uploadService]);

    return progress;
};
