import React, { DragEvent, forwardRef, RefObject, useMemo } from 'react';
import cn from 'classnames';
import { baselineCloudUpload, error as errorIcon } from '../../../utilities/icons/iconify';
import { Icon } from '@iconify/react';
import styles from '../ImageUploader.module.scss';
import { Button } from '../../Button/Button';
import { IUploaderErrorMessage } from '../ImageUploader';
import { ImageUploaderService } from '../ImageUploader.service';
import { TAllowedFileTypes } from '../ImageUploader.types';

interface IImageUploaderIdleStateProps {
    showIdlePage?: boolean;
    isDragging: boolean;
    error: IUploaderErrorMessage;
    allowMultiple: boolean;
    allowedFileTypes: TAllowedFileTypes[];
    inputFileOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFileDragOver?: (e: DragEvent<HTMLDivElement>) => void;
    onFileDragLeave?: (e: DragEvent<HTMLDivElement>) => void;
    onFileDrop?: (e: DragEvent<HTMLDivElement>) => void;
}

export const ImageUploaderIdleState = forwardRef<HTMLInputElement, IImageUploaderIdleStateProps>(
    (props, inputFileRef) => {
        // props
        const { isDragging, error, showIdlePage, allowMultiple, allowedFileTypes } = props;
        const { onFileDragLeave, onFileDragOver, onFileDrop, inputFileOnChange } = props;

        // hanldlers
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
                {showIdlePage && (
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
                            {error.enabled ? error.message : <>Drag and drop to upload</>} <br />
                            <span className={styles.supportedFilesText}>
                                supported formats <br />( {formattedAllowedFileTypes} )
                            </span>
                        </div>
                        <Button
                            className={styles.uploadButton}
                            color="secondary"
                            size="medium"
                            variant="contained"
                            label="Upload"
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
    },
);
