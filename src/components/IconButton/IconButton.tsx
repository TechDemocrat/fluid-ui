import React from 'react';
import { IIconButton } from './IconButton.types';
import styles from './IconButton.module.scss';
import cn from 'classnames';

export const IconButton = (props: IIconButton) => {
    const { title, children, disabled, padding = 5, onClick } = props;
    const classnames = cn(styles.iconWrapper, {
        [styles.disabled]: disabled,
    });

    return (
        <div className={classnames} style={{ padding: padding }} title={title} onClick={onClick}>
            {children}
        </div>
    );
};
