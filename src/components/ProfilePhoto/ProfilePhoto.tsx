import React from 'react';
import cn from 'classnames';

import { IProfilePhotoProps } from './ProfilePhoto.types';
import styles from './ProfilePhoto.module.scss';
import { Button } from '../Button/Button';
import { Icon } from '@iconify/react';
import { account } from '../../utilities/icons/iconify';

export const ProfilePhoto = (props: IProfilePhotoProps) => {
    // props
    const { src, className, size = 'small', title, onChange } = props;

    //refs
    const uploadedImage = React.useRef<HTMLImageElement>(null);
    const imageUploader = React.useRef<HTMLInputElement>(null);

    //handlers
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (uploadedImage.current) {
                    uploadedImage.current.src = reader.result as string;
                }
            };
            reader.readAsDataURL(file);
            onChange(file);
        }
    };

    const profileClass = cn(
        styles.profileDisplay,
        { [styles.small]: size === 'small' },
        { [styles.large]: size === 'large' },
        { [styles.medium]: size === 'medium' },
    );

    return (
        <div className={cn(styles.profileWrapper, className)} title={title}>
            <div className={profileClass}>
                {src ? (
                    <img
                        src={src ?? undefined}
                        ref={uploadedImage}
                        className={cn(styles.profileImage)}
                    />
                ) : (
                    <Icon icon={account} className={styles.profileImage} />
                )}
            </div>
            <div className={cn(styles.profileInput)}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={imageUploader}
                />
                <Button
                    variant="contained"
                    color="primary"
                    size={size}
                    onClick={() => imageUploader?.current?.click()}
                >
                    <span>Upload</span>
                </Button>
            </div>
        </div>
    );
};
