import React, {
    ChangeEventHandler,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import cn from 'classnames';

import { IContentUploaderProps } from './ContentUploader.types';
import styles from './ContentUploader.module.scss';
import { Icon } from '@iconify/react';
import { baselineCloudUpload, close, error as errorIcon } from '../../assets/icons/iconify';
import { Button } from '../Button/Button';
import { Spinner } from '../Spinner/Spinner';
import { IconButton } from '../IconButton/IconButton';
import { TimeFromNow } from '../TimeFromNow/TimeFromNow';
import { ContentUploaderService } from './ContentUploader.service';
import { useIsMounted } from '../../hooks';

export const ContentUploader = (props: IContentUploaderProps) => {
    // props
    const {
        label = 'Video',
        status = 'idle',
        uploadedContentMeta,
        uploadProgress,
        allowedFileTypes = [],
        onUpload,
    } = props;
    const { previewArea, uploadedAt = '', onDelete } = uploadedContentMeta ?? {};
    const { loaded, total, fileName, onCancel } = uploadProgress ?? {};
    const errorInitialState = useMemo(() => ({ enabled: false, message: '' }), []);

    // hooks
    const isMounted = useIsMounted();

    // state
    const [isDragging, setIsDragging] = useState(false);
    const [error, seterror] = useState(errorInitialState);

    // refs
    const inputFileRef = useRef<HTMLInputElement>(null);
    const dragAndDropContainerRef = useRef<HTMLDivElement>(null);
    const previousLoaded = useRef<number>(0);

    // handlers
    const setErrorMessage = useCallback(
        (message: string, timeOut = 2000) => {
            seterror({ enabled: true, message });
            // with timeout of 1s to allow the error message to be displayed
            setTimeout(() => isMounted() && seterror(errorInitialState), timeOut);
        },
        [isMounted, errorInitialState],
    );

    const validateAndTriggerOnUpload = useCallback(
        (files: FileList | null | undefined) => {
            const { validationError, file } = ContentUploaderService.validateSelectedFile(
                files,
                allowedFileTypes,
            );
            if (validationError) {
                if (inputFileRef.current) inputFileRef.current.value = ''; // resets the input file field
                return setErrorMessage(validationError);
            }
            // on validation success
            onUpload?.(file as File);
        },
        [allowedFileTypes, setErrorMessage, onUpload],
    );

    const inputFileOnChange: ChangeEventHandler<HTMLInputElement> = (e) =>
        validateAndTriggerOnUpload(e.target.files);

    const onFileDrop = useCallback(
        (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            validateAndTriggerOnUpload(e.dataTransfer?.files);
        },
        [validateAndTriggerOnUpload],
    );

    const onFileDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const onFileDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    // effects
    useEffect(() => {
        const currentDragAndDropContainer = dragAndDropContainerRef.current; // to avoid race conditions, the referencce has been localized here
        currentDragAndDropContainer?.addEventListener('dragover', onFileDragOver);
        currentDragAndDropContainer?.addEventListener('drop', onFileDrop);
        currentDragAndDropContainer?.addEventListener('dragenter', onFileDragOver);
        currentDragAndDropContainer?.addEventListener('dragleave', onFileDragLeave);

        return () => {
            currentDragAndDropContainer?.removeEventListener('dragover', onFileDragOver);
            currentDragAndDropContainer?.removeEventListener('drop', onFileDrop);
            currentDragAndDropContainer?.removeEventListener('dragenter', onFileDragOver);
            currentDragAndDropContainer?.removeEventListener('dragleave', onFileDragLeave);
        };
    }, [onFileDrop]);

    // compute
    const { formattedLoaded, formattedTotal, percentage, remainingTime } = useMemo(
        () => ContentUploaderService.getUploadProgressInfo(status, previousLoaded, loaded, total),
        [status, previousLoaded, loaded, total],
    );
    const formattedAllowedFileTypes = useMemo(
        () => ContentUploaderService.getFormattedSupportedFileTypes(allowedFileTypes),
        [allowedFileTypes],
    );

    // paint
    return (
        <div className={cn(styles.wrapper)}>
            <div className={styles.core}>
                <div className={styles.label}>{label}</div>
                <div className={styles.contentWrapper}>
                    {status === 'idle' && (
                        <div
                            className={cn(styles.idleState, {
                                [styles.onDragOver]: isDragging,
                                [styles.onError]: error.enabled,
                            })}
                            ref={dragAndDropContainerRef}
                        >
                            <Icon
                                icon={error.enabled ? errorIcon : baselineCloudUpload}
                                className={cn(styles.uploadIcon, {
                                    [styles.errorColor]: error.enabled,
                                })}
                            />
                            <div className={styles.uploadText}>
                                {error.enabled ? error.message : <>Drag and drop to upload</>}{' '}
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
                                label="Upload"
                                onClick={() => inputFileRef.current?.click()}
                            />
                            <input
                                hidden
                                type="file"
                                ref={inputFileRef}
                                onChange={inputFileOnChange}
                                accept={formattedAllowedFileTypes}
                                multiple={false}
                            />
                        </div>
                    )}
                    {status === 'uploading' && (
                        <div className={styles.uploadingState}>
                            <div className={styles.coreUploadProgress}>
                                <span className={styles.uploadContentFileTitle}>{fileName}</span>
                                <Spinner size="large" color="primary" />
                                <span>Uploading {percentage}%</span>
                            </div>
                            <div className={styles.uploadProgressDetailedView}>
                                <div className={styles.uploadProgressMeta}>
                                    Uploaded {formattedLoaded} / {formattedTotal} | {remainingTime}{' '}
                                    left
                                </div>
                                <div className={styles.uploadProgressAction}>
                                    <IconButton title="Cancel upload" onClick={onCancel}>
                                        <Icon icon={close} className={styles.uploadCanceIcon} />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    )}
                    {status === 'uploaded' && (
                        <div className={styles.uploadingState}>
                            <div className={styles.coreUploadProgress}>{previewArea}</div>
                            <div className={styles.uploadProgressDetailedView}>
                                <div className={styles.uploadProgressMeta}>
                                    Last Uploaded at{' '}
                                    <TimeFromNow size="medium" dateString={uploadedAt} />
                                </div>
                                <div className={styles.uploadProgressAction}>
                                    <IconButton title="Delete content" onClick={onDelete}>
                                        <Icon icon={close} className={styles.uploadCanceIcon} />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
