import React, { DragEvent, forwardRef, RefObject, useMemo } from 'react';
import cn from 'classnames';
import { baselineCloudUpload, error as errorIcon } from '../../../assets/icons/iconify';
import { Icon } from '@iconify/react';
import styles from '../ImageUploader.module.scss';
import { Button } from '../../Button/Button';
import { ImageUploaderService } from '../ImageUploader.service';
import { IUploaderErrorMessage, TAllowedFileTypes } from '../ImageUploader.types';

interface IImageUploaderLandingPageProps {
    label: string;
    showLandingPage?: boolean;
    isDragging: boolean;
    error: IUploaderErrorMessage;
    allowMultiple: boolean;
    allowedFileTypes: TAllowedFileTypes[];
    isPreparingToUpload: boolean;
    inputFileOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFileDragOver?: (e: DragEvent<HTMLDivElement>) => void;
    onFileDragLeave?: (e: DragEvent<HTMLDivElement>) => void;
    onFileDrop?: (e: DragEvent<HTMLDivElement>) => void;
}

export const ImageUploaderLandingPage = forwardRef<
    HTMLInputElement,
    IImageUploaderLandingPageProps
>((props, inputFileRef) => {
    // props
    const {
        isDragging,
        error,
        showLandingPage,
        allowMultiple,
        allowedFileTypes,
        label,
        isPreparingToUpload,
    } = props;
    const { onFileDragLeave, onFileDragOver, onFileDrop, inputFileOnChange } = props;

    // handlers
    const onUploadButtonClick = () => {
        (inputFileRef as RefObject<HTMLDivElement>)?.current?.click();
    };

    // compute
    const formattedAllowedFileTypes = useMemo(
        () => ImageUploaderService.getFormattedSupportedFileTypes(allowedFileTypes),
        [allowedFileTypes],
    );

    // paint
    return (
        <>
            {showLandingPage && (
                <div
                    className={cn(styles.idleState, {
                        [styles.onDragOver]: isDragging,
                        [styles.onError]: error.enabled,
                    })}
                    onDragOver={onFileDragOver}
                    onDragEnter={onFileDragOver}
                    onDragLeave={onFileDragLeave}
                    onDrop={onFileDrop}
                >
                    <Icon
                        icon={error.enabled ? errorIcon : baselineCloudUpload}
                        className={cn(styles.uploadIcon, {
                            [styles.errorColor]: error.enabled,
                        })}
                    />
                    <div className={styles.uploadText}>
                        {error.enabled ? (
                            error.message
                        ) : (
                            <>Drag and drop to upload {label.toLowerCase()}</>
                        )}{' '}
                        <br />
                        <span className={styles.supportedFilesText}>
                            supported formats <br />( {formattedAllowedFileTypes} )
                        </span>
                    </div>
                    <Button
                        className={styles.uploadButton}
                        color="secondary"
                        size="medium"
                        variant="contained"
                        label={isPreparingToUpload ? 'Preparing to Upload...' : 'Upload'}
                        disabled={isPreparingToUpload}
                        onClick={onUploadButtonClick}
                    />
                </div>
            )}
            <input
                hidden
                type="file"
                ref={inputFileRef}
                onChange={inputFileOnChange}
                accept={formattedAllowedFileTypes}
                multiple={allowMultiple}
            />
        </>
    );
});
