import React, {
    ChangeEventHandler,
    DragEvent,
    useCallback,
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
import { baselineAdd, closeCircle } from '../../utilities/icons/iconify';
import { times } from 'lodash';

export interface IUploaderErrorMessage {
    enabled: boolean;
    message: string;
}

export const ImageUploader = (props: IImageUploaderProps) => {
    // props
    const { label = 'Photo', status = 'uploaded', allowedFileTypes = [], onUpload } = props;
    const errorInitialState = useMemo<IUploaderErrorMessage>(
        () => ({ enabled: false, message: '' }),
        [],
    );

    // hooks
    const isMounted = useIsMounted();

    // state
    const [isDragging, setIsDragging] = useState(false);
    const [error, seterror] = useState(errorInitialState);

    // refs
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
        (files: FileList | null | undefined) => {
            const { validationError, file } = ImageUploaderService.validateSelectedFile(
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
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            validateAndTriggerOnUpload(e.dataTransfer?.files);
        },
        [validateAndTriggerOnUpload],
    );

    const onFileDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const onFileDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    // effects

    // compute

    // paint
    return (
        <div className={cn(styles.wrapper)}>
            <div className={styles.core}>
                <div className={styles.label}>{label}</div>
                <div className={styles.contentWrapper}>
                    {status === 'idle' && (
                        <ImageUploaderIdleState
                            isDragging={isDragging}
                            error={error}
                            ref={inputFileRef}
                            allowedFileTypes={allowedFileTypes}
                            onFileDragOver={onFileDragOver}
                            onFileDragLeave={onFileDragLeave}
                            onFileDrop={onFileDrop}
                            inputFileOnChange={inputFileOnChange}
                        />
                    )}
                    {(status === 'uploading' || status === 'uploaded') && (
                        <div className={styles.previewWithUploaderState}>
                            <div className={styles.previewWrapper}>
                                <img
                                    className={styles.previewImage}
                                    src={
                                        'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png/220px-Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png'
                                    }
                                    alt="preview"
                                    draggable={false}
                                />
                            </div>
                            <div className={styles.imageStackWrapper}>
                                <div className={styles.imageStackContainerWrapper}>
                                    <div className={styles.imageStackContainer}>
                                        {times(2).map((value) => (
                                            <div className={styles.imageStackNode} key={value}>
                                                <img
                                                    className={styles.imageStackImage}
                                                    src={
                                                        'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png/220px-Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png'
                                                    }
                                                    draggable={false}
                                                />
                                                <div className={styles.imageStackProgressWrapper}>
                                                    <CircularProgress
                                                        radius={25}
                                                        strokeWidth={3}
                                                        labelSize={10}
                                                        currentProgress={50}
                                                        totalProgress={100}
                                                    />
                                                </div>
                                                <Icon
                                                    className={styles.imageStackNodeDeleteIcon}
                                                    icon={closeCircle}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div
                                    className={cn(styles.imageStackNode, styles.imageStackNodeAdd)}
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
            </div>
        </div>
    );
};
