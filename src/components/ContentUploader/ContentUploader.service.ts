import { MutableRefObject } from 'react';
import { TContentUploadStatus } from './ContentUploader.types';

interface IUploadProgerssMeta {
    formattedTotal: string;
    formattedLoaded: string;
    percentage: number;
    remainingTime: string;
}

export class ContentUploaderService {
    // used to calculate the remaining upload time
    static uploadStartTime: number;

    static getUploadProgressInfo = (
        status: TContentUploadStatus,
        previousLoaded: MutableRefObject<number>,
        loaded = 0,
        total = 0,
    ): IUploadProgerssMeta => {
        if (status !== 'uploading')
            return {
                formattedTotal: '',
                formattedLoaded: '',
                percentage: 0,
                remainingTime: '',
            };
        const formattedTotal = ContentUploaderService.formatBytes(total);
        const formattedLoaded = ContentUploaderService.formatBytes(loaded);
        let percentage = Math.round((loaded / total) * 100);
        percentage = percentage || 0;
        const remainingTime = ContentUploaderService.getRemainingTime(
            previousLoaded,
            loaded,
            total,
        );
        // set previous loaded at last
        ContentUploaderService.setPreviousLoaded(loaded, previousLoaded);

        return {
            formattedTotal,
            formattedLoaded,
            percentage,
            remainingTime,
        };
    };

    private static formatBytes = (bytes: number): string => {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const baseBytes = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(baseBytes));
        const formattedSize = parseFloat((bytes / Math.pow(baseBytes, i)).toFixed(2));
        return `${formattedSize} ${sizes[i]}`;
    };

    private static setPreviousLoaded = (
        loaded: number,
        previousLoaded: MutableRefObject<number>,
    ): void => {
        previousLoaded.current = loaded;
    };

    private static getRemainingTime = (
        previousLoaded: MutableRefObject<number>,
        loaded: number,
        total: number,
    ): string => {
        if (previousLoaded.current === 0) {
            ContentUploaderService.uploadStartTime = new Date().getTime();
        }

        // calculate remaining time
        const remainingBytes = total - loaded;
        const elapsedTime = new Date().getTime() - ContentUploaderService.uploadStartTime;
        const remainingTime = Math.round(elapsedTime / (loaded / remainingBytes));
        const remainingTimeInSeconds = Math.round(remainingTime / 1000);
        const hours = Math.floor(remainingTimeInSeconds / 3600) || 0;
        const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60) || 0;
        const seconds = remainingTimeInSeconds % 60 || 0;

        if (hours > 0) {
            return `${hours} hour(s)`;
        }

        if (minutes > 0) {
            return `${minutes} minute(s)`;
        }

        return `${seconds} second(s)`;
    };
}
