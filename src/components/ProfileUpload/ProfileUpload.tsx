import React from 'react';
import cn from 'classnames';

import { IProfileUploadProps } from './ProfileUpload.types';
import styles from './ProfileUpload.module.scss';
import { Button } from '../Button/Button';
import { ProfileImage } from '../ProfileImage/ProfileImage';

export const ProfileUpload = (props: IProfileUploadProps) => {
    // props
    const { src, className, size = 'small', title, onChange } = props;

    //refs
    const imageUploader = React.useRef<HTMLInputElement>(null);

    //handlers
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0];
        if (file) {
            onChange(file);
        }
    };

    return (
        <div className={cn(styles.profileUploadWrapper, className)} title={title}>
            <ProfileImage src={src} title="Profile Image" size={size} />
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
