import React from 'react';
import cn from 'classnames';

import { IProfileImageProps } from './ProfileImage.types';
import styles from './ProfileImage.module.scss';
import { Icon } from '@iconify/react';
import { account } from '../../assets/icons/iconify';

export const ProfileImage = (props: IProfileImageProps) => {
    // props
    const { className, src, title, size = 'small' } = props;

    const profileClass = cn(
        styles.profileDisplay,
        { [styles.small]: size === 'small' },
        { [styles.medium]: size === 'medium' },
        { [styles.large]: size === 'large' },
    );

    // paint
    return (
        <div className={cn(styles.profileWrapper, className)} title={title}>
            <div className={profileClass}>
                {src ? (
                    <img src={src} className={cn(styles.profileImage)} />
                ) : (
                    <Icon icon={account} className={styles.profileImage} />
                )}
            </div>
        </div>
    );
};
