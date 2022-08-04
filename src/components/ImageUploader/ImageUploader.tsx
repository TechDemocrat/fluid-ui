import React, {
    ChangeEventHandler,
    CSSProperties,
    DragEvent,
    MouseEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import cn from 'classnames';

import {
    IImageUploaderContent,
    IImageUploaderProps,
    IUploaderErrorMessage,
} from './ImageUploader.types';
import styles from './ImageUploader.module.scss';
import { ImageUploaderService } from './ImageUploader.service';
import { ImageUploaderLandingPage } from './components/ImageUploaderLandingPage';
import { Icon } from '@iconify/react';
import { baselineAdd, baselineEdit } from '../../assets/icons/iconify';
import { IconButton } from '../IconButton/IconButton';
import { ImageUploaderImageStack } from './components/ImageUploaderImageStack';
import { DropToUploadOverlay } from './components/DropToUploadOverlay';
import { onImageLoadError } from '../../utilities';
import { UploadService } from '../../services/UploadService/UploadService';
import { useIsMounted } from '../../hooks';

export const ImageUploader = (props: IImageUploaderProps) => {
    // props
    const {
        label = 'Photo',
        allowMultiple = false,
        contents,
        viewMode,
        allowedFileTypes = [],
        showEditIcon = false,
        width,
        height,
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
    const [error, setError] = useState(errorInitialState);

    // refs
    const inputFileRef = useRef<HTMLInputElement>(null);

    // handlers
    const setErrorMessage = useCallback(
        (message: string, timeOut = 2000) => {
            setError({ enabled: true, message });
            // with timeout of 1s to allow the error message to be displayed
            setTimeout(() => isMounted() && setError(errorInitialState), timeOut);
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

    const onDeleteImage = (content: IImageUploaderContent) => (e: MouseEvent<SVGElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete?.(content);
    };

    // effects
    useEffect(() => {
        if (previewImageIndex >= contents.length || previewImageIndex < 0) {
            setPreviewImageIndex(contents.length - 1 || 0);
        }
    }, [contents, previewImageIndex]);

    // compute
    const isIdle = viewMode === 'edit' && contents.length === 0;
    const currentContent = useMemo(
        () => contents[previewImageIndex] ?? contents[0],
        [contents, previewImageIndex],
    );
    const currentImageUrl = useMemo(() => {
        if (currentContent) {
            return currentContent.type === 'remote'
                ? currentContent.url
                : UploadService.getInstance().getUploadProgressData(currentContent.id).url;
        }
        return '';
    }, [currentContent]);

    const wrapperStyle: CSSProperties = {
        width,
        height,
    };

    // paint
    return (
        <div className={cn(styles.wrapper)} style={wrapperStyle}>
            <div
                className={styles.core}
                onDragOver={onFileDragOver}
                onDragEnter={onFileDragOver}
                onDragLeave={onFileDragLeave}
                onDrop={onFileDrop}
            >
                <div className={styles.label}>{label}</div>
                <div className={cn(styles.contentWrapper)}>
                    <ImageUploaderLandingPage
                        label={label}
                        showLandingPage={isIdle}
                        ref={inputFileRef}
                        isDragging={isDragging}
                        error={error}
                        allowedFileTypes={allowedFileTypes}
                        allowMultiple={allowMultiple}
                        inputFileOnChange={inputFileOnChange}
                    />
                    {!isIdle && (
                        <div className={cn(styles.previewWithUploaderState)}>
                            {/* Place edit icon if needed */}
                            <div className={styles.previewActionsWrapper}>
                                {showEditIcon === true && viewMode === 'view' && (
                                    <IconButton title="Edit" padding={3}>
                                        <Icon
                                            className={styles.previewActionIcon}
                                            icon={baselineEdit}
                                        />
                                    </IconButton>
                                )}
                            </div>
                            <div className={styles.previewWrapper}>
                                <img
                                    className={styles.previewImage}
                                    src={currentImageUrl}
                                    alt="preview"
                                    draggable={false}
                                    onError={onImageLoadError}
                                />
                            </div>
                            <div className={styles.imageStackWrapper}>
                                <div className={styles.imageStackContainerWrapper}>
                                    <ImageUploaderImageStack
                                        viewMode={viewMode}
                                        contents={contents}
                                        previewImageIndex={previewImageIndex}
                                        onPreviewImageChange={onPreviewImageChange}
                                        onDeleteImage={onDeleteImage}
                                    />
                                </div>
                                {viewMode === 'edit' && (
                                    <div
                                        className={cn(
                                            styles.imageStackNode,
                                            styles.imageStackNodeAdd,
                                        )}
                                        role="button"
                                        onClick={onAddButtonClick}
                                    >
                                        <Icon
                                            className={styles.stackNodeUploadIcon}
                                            icon={baselineAdd}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {!isIdle && isDragging && <DropToUploadOverlay />}
            </div>
        </div>
    );
};
