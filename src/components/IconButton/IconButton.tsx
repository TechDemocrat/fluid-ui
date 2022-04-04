import React from 'react';
import { IIconButton } from './IconButton.types';
import styles from './IconButton.module.scss';
import cn from 'classnames';

const getIconSize = (size: IIconButton['size']) => {
    switch (size) {
        case 'small':
            return styles.small;
        case 'medium':
            return styles.medium;
        case 'large':
            return styles.large;
        default:
            return styles.medium;
    }
};

export const IconButton = (props: IIconButton) => {
    const { title, children, disabled, size, onClick } = props;
    const classnames = cn(styles.iconWrapper, getIconSize(size), {
        [styles.disabled]: disabled,
    });

    return (
        <div className={classnames} title={title} onClick={onClick}>
            {children}
        </div>
    );
};
