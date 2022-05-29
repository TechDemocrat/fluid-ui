import { TAllowedFileTypes } from './ImageUploader.types';

export class ImageUploaderService {
    // used to calculate the remaining upload time
    static uploadStartTime: number[] = [];

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
}
