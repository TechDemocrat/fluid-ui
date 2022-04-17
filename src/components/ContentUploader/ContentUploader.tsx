import React, { useRef } from 'react';
import cn from 'classnames';

import { IContentUploaderProps } from './ContentUploader.types';
import styles from './ContentUploader.module.scss';
import { Icon } from '@iconify/react';
import { baselineCloudUpload, close } from '../../utilities/icons/iconify';
import { Button } from '../Button/Button';
import { Spinner } from '../Spinner/Spinner';
import { IconButton } from '../IconButton/IconButton';
import { TimeFromNow } from '../TimeFromNow/TimeFromNow';
import { ContentUploaderService } from './ContentUploader.service';

export const ContentUploader = (props: IContentUploaderProps) => {
    // props
    const { status = 'idle', uploadedContentMeta, uploadProgress } = props;
    const { previewArea, uploadedAt = '', onDelete } = uploadedContentMeta ?? {};
    const { loaded, total, fileName, onCancel } = uploadProgress ?? {};

    // refs
    const previousLoaded = useRef<number>(0);

    // compute
    const { formattedLoaded, formattedTotal, percentage, remainingTime } =
        ContentUploaderService.getUploadProgressInfo(status, previousLoaded, loaded, total);

    // paint
    return (
        <div className={cn(styles.wrapper)}>
            <div className={styles.core}>
                <div className={styles.label}>Video</div>
                <div className={styles.contentWrapper}>
                    {status === 'idle' && (
                        <div className={styles.idleState}>
                            <Icon icon={baselineCloudUpload} className={styles.uploadIcon} />
                            <div className={styles.uploadText}>
                                Drag and drop to upload your video
                            </div>
                            <Button
                                className={styles.uploadButton}
                                color="secondary"
                                size="medium"
                                variant="contained"
                                label="Upload"
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
                                    <IconButton
                                        size="large"
                                        title="Cancel upload"
                                        onClick={onCancel}
                                    >
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
                                    <IconButton
                                        size="large"
                                        title="Delete content"
                                        onClick={onDelete}
                                    >
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
