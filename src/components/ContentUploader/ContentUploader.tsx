import React from 'react';
import cn from 'classnames';

import { IContentUploaderProps } from './ContentUploader.types';
import styles from './ContentUploader.module.scss';
import { Icon } from '@iconify/react';
import { baselineCloudUpload, close } from '../../utilities/icons/iconify';
import { Button } from '../Button/Button';
import { Spinner } from '../Spinner/Spinner';
import { IconButton } from '../IconButton/IconButton';
// import { ContentUploaderService } from './ContentUploader.service';

export const ContentUploader = (props: IContentUploaderProps) => {
    // props
    const { status = 'uploaded' } = props;

    // compute
    // const originalTitle = ContentUploaderService.getTitle(title);

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
                                <span className={styles.uploadContentFileTitle}>
                                    Video file.mp4
                                </span>
                                <Spinner size="large" color="primary" />
                                <span>Uploading 10%</span>
                            </div>
                            <div className={styles.uploadProgressDetailedView}>
                                <div className={styles.uploadProgressMeta}>
                                    Uploaded 100MB / 1.5GB | 5 minutes left
                                </div>
                                <div className={styles.uploadProgressAction}>
                                    <IconButton size="large" title="Cancel upload">
                                        <Icon icon={close} className={styles.uploadCanceIcon} />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    )}
                    {status === 'uploaded' && (
                        <div className={styles.uploadingState}>
                            <div className={styles.coreUploadProgress}>Content preview area</div>
                            <div className={styles.uploadProgressDetailedView}>
                                <div className={styles.uploadProgressMeta}>
                                    Last Uploaded at 5 days ago
                                </div>
                                <div className={styles.uploadProgressAction}>
                                    <IconButton size="large" title="Delete content">
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
