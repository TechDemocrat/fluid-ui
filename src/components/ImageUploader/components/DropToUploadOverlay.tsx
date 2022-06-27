import React from 'react';
import styles from '../ImageUploader.module.scss';
import { Icon } from '@iconify/react';
import { baselineCloudUpload } from '../../../assets/icons/iconify';

export const DropToUploadOverlay = () => {
    return (
        <div className={styles.dropToUploadOverlay}>
            <div className={styles.dropToUploadText}>
                <Icon icon={baselineCloudUpload} className={styles.uploadIcon} />
                <span>Drop to Upload</span>
            </div>
        </div>
    );
};
