import { MutableRefObject } from 'react';
import { IImageUploaderContent, TAllowedFileTypes } from './ImageUploader.types';

interface IUploadProgerssMeta {
    formattedTotal: string;
    formattedLoaded: string;
    percentage: number;
    remainingTime: string;
}

export class ImageUploaderService {
    // used to calculate the remaining upload time
    static uploadStartTime: number[] = [];

    static getUploadProgressInfo = (
        index: number,
        previousLoaded: MutableRefObject<number[]>,
        progress: IImageUploaderContent['progress'],
    ): IUploadProgerssMeta => {
        const { status, loaded, total } = progress ?? { status: 'done', loaded: 0, total: 0 };

        if (status === 'done') {
            return {} as IUploadProgerssMeta;
        }
        const formattedTotal = ImageUploaderService.formatBytes(total);
        const formattedLoaded = ImageUploaderService.formatBytes(loaded);
        let percentage = Math.round((loaded / total) * 100);
        percentage = percentage || 0;
        percentage = percentage > 100 ? 100 : percentage;
        const remainingTime = ImageUploaderService.getRemainingTime(
            index,
            previousLoaded,
            loaded,
            total,
        );
        // set previous loaded at last
        ImageUploaderService.setPreviousLoaded(index, loaded, previousLoaded);

        return {
            formattedTotal,
            formattedLoaded,
            percentage,
            remainingTime,
        };
    };

    static getFormattedSupportedFileTypes = (allowedFileTypes: TAllowedFileTypes[]): string => {
        if (!allowedFileTypes) return '';
        return allowedFileTypes.join(', ');
    };

    static validateSelectedFiles = (
        files: FileList | null | undefined,
        allowedFileTypes: TAllowedFileTypes[],
    ): { validationError?: string | undefined; files?: File[] } => {
        if (!files) return { validationError: 'No files selected' };

        if (files.length === 0) return { validationError: 'No files selected' };

        const validFiles: File[] = [];
        for (let i = 0; i < files.length; i++) {
            const fileType = files[i].type.split('/')[0];
            const isAllowed =
                allowedFileTypes.length === 0 ||
                allowedFileTypes.some((allowedType: TAllowedFileTypes) => {
                    return allowedType.includes(fileType);
                });
            if (isAllowed) {
                validFiles.push(files[i]);
            }
        }

        return { files: validFiles };
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
        index: number,
        loaded: number,
        previousLoaded: MutableRefObject<number[]>,
    ): void => {
        previousLoaded.current[index] = loaded;
    };

    private static getRemainingTime = (
        index: number,
        previousLoaded: MutableRefObject<number[]>,
        loaded: number,
        total: number,
    ): string => {
        if (previousLoaded.current[index] === 0) {
            ImageUploaderService.uploadStartTime[index] = new Date().getTime();
        }

        // calculate remaining time
        const remainingBytes = total - loaded;
        const elapsedTime = new Date().getTime() - ImageUploaderService.uploadStartTime[index];
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

    public static getBase64Image(img: ImageBitmap) {
        // Create an empty canvas element
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        // Copy the image contents to the canvas
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to
        // guess the original format, but be aware the using "image/jpg"
        // will re-encode the image.
        const dataURL = canvas.toDataURL('image/png');

        return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
    }
}
