import React, {
    ChangeEventHandler,
    DragEvent,
    MouseEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import cn from 'classnames';

import { IImageUploaderProps } from './ImageUploader.types';
import styles from './ImageUploader.module.scss';
import { ImageUploaderService } from './ImageUploader.service';
import { useIsMounted } from '../../utilities/cutomHooks';
import { ImageUploaderIdleState } from './components/ImageUploaderIdleState';
import { CircularProgress } from '../CircularProgress/CircularProgress';
import { Icon } from '@iconify/react';
import {
    baselineAdd,
    baselineCloudUpload,
    baselineDeleteOutline,
    baselineZoomIn,
    closeCircle,
} from '../../utilities/icons/iconify';
import { IconButton } from '../IconButton/IconButton';

export interface IUploaderErrorMessage {
    enabled: boolean;
    message: string;
}

export const ImageUploader = (props: IImageUploaderProps) => {
    // props
    const {
        label = 'Photo',
        allowMultiple = false,
        uploadProgress,
        allowedFileTypes = [],
        onUpload,
        onDelete,
    } = props;
    const errorInitialState = useMemo<IUploaderErrorMessage>(
        () => ({ enabled: false, message: '' }),
        [],
    );

    // hooks
    const isMounted = useIsMounted();

    // state
    const [isDragging, setIsDragging] = useState(false);
    const [previewImageIndex, setPreviewImageIndex] = useState<number>(0);
    const [error, seterror] = useState(errorInitialState);

    // refs
    const previousLoadedRef = useRef<number[]>([]);
    const inputFileRef = useRef<HTMLInputElement>(null);

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
        (selectedFiles: FileList | null | undefined) => {
            const { validationError, files } = ImageUploaderService.validateSelectedFiles(
                selectedFiles,
                allowedFileTypes,
            );
            if (validationError) {
                if (inputFileRef.current) inputFileRef.current.value = ''; // resets the input file field
                return setErrorMessage(validationError);
            }
            // on validation success
            onUpload?.(files as File[]);
        },
        [allowedFileTypes, setErrorMessage, onUpload],
    );

    const inputFileOnChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            validateAndTriggerOnUpload(e.target.files);
        },
        [validateAndTriggerOnUpload],
    );

    const onFileDrop = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            validateAndTriggerOnUpload(e.dataTransfer?.files);
        },
        [validateAndTriggerOnUpload],
    );

    const onFileDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const onFileDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const onAddButtonClick = () => {
        inputFileRef.current?.click();
    };

    const onPreviewImageChange = (index: number) => () => {
        setPreviewImageIndex(index);
    };

    const onDeleteImage =
        (index: number = previewImageIndex) =>
        (e: MouseEvent<SVGElement>) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete?.(index);
        };

    // effects
    useEffect(() => {
        if (previewImageIndex >= uploadProgress.length || previewImageIndex < 0) {
            setPreviewImageIndex(uploadProgress.length - 1 || 0);
        }
    }, [uploadProgress, previewImageIndex]);

    // compute
    const isIdle = uploadProgress.length === 0;
    const currentImage = uploadProgress[previewImageIndex] ?? uploadProgress[0];

    // paint
    return (
        <div className={cn(styles.wrapper)}>
            <div
                className={styles.core}
                onDragOver={onFileDragOver}
                onDragEnter={onFileDragOver}
                onDragLeave={onFileDragLeave}
                onDrop={onFileDrop}
            >
                <div className={styles.label}>{label}</div>
                <div className={cn(styles.contentWrapper)}>
                    <ImageUploaderIdleState
                        showIdlePage={isIdle}
                        ref={inputFileRef}
                        isDragging={isDragging}
                        error={error}
                        allowedFileTypes={allowedFileTypes}
                        allowMultiple={allowMultiple}
                        inputFileOnChange={inputFileOnChange}
                    />
                    {!isIdle && (
                        <div className={cn(styles.previewWithUploaderState)}>
                            {/* delete action button */}
                            <div className={styles.previewActionsWrapper}>
                                <IconButton title="Zoom in" padding={3}>
                                    <Icon
                                        className={styles.previewActionIcon}
                                        icon={baselineZoomIn}
                                    />
                                </IconButton>
                                <IconButton
                                    title="Remove current image"
                                    padding={3}
                                    onClick={onDeleteImage() as () => void}
                                >
                                    <Icon
                                        className={styles.previewActionIcon}
                                        icon={baselineDeleteOutline}
                                    />
                                </IconButton>
                            </div>
                            <div className={styles.previewWrapper}>
                                {currentImage && (
                                    <img
                                        className={styles.previewImage}
                                        src={currentImage.url}
                                        alt="preview"
                                        draggable={false}
                                    />
                                )}
                            </div>
                            <div className={styles.imageStackWrapper}>
                                <div className={styles.imageStackContainerWrapper}>
                                    <div className={styles.imageStackContainer}>
                                        {uploadProgress.map(({ url, id, progress }, index) => {
                                            const { percentage } =
                                                ImageUploaderService.getUploadProgressInfo(
                                                    index,
                                                    previousLoadedRef,
                                                    progress,
                                                );
                                            return (
                                                <div
                                                    className={cn(styles.imageStackNode, {
                                                        [styles.imageStackNodeActive]:
                                                            index === previewImageIndex,
                                                    })}
                                                    key={id}
                                                    onClick={onPreviewImageChange(index)}
                                                >
                                                    <img
                                                        className={styles.imageStackImage}
                                                        src={url}
                                                        draggable={false}
                                                    />
                                                    {progress?.status === 'uploading' && (
                                                        <div
                                                            className={
                                                                styles.imageStackProgressWrapper
                                                            }
                                                        >
                                                            <CircularProgress
                                                                radius={25}
                                                                strokeWidth={3}
                                                                labelSize={10}
                                                                currentProgress={percentage}
                                                                totalProgress={100}
                                                            />
                                                        </div>
                                                    )}
                                                    <Icon
                                                        className={styles.imageStackNodeDeleteIcon}
                                                        icon={closeCircle}
                                                        onClick={onDeleteImage(index)}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div
                                    className={cn(styles.imageStackNode, styles.imageStackNodeAdd)}
                                    role="button"
                                    onClick={onAddButtonClick}
                                >
                                    <Icon
                                        className={styles.stackNodeUploadIcon}
                                        icon={baselineAdd}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {!isIdle && isDragging && (
                    <div className={styles.dropToUploadOverlay}>
                        <div className={styles.dropToUploadText}>
                            <Icon icon={baselineCloudUpload} className={cn(styles.uploadIcon)} />
                            <span>Drop to Upload</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
