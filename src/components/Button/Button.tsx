import React from 'react';
import { IButtonProps } from './Button.types';
import styles from './Button.module.scss';
import cn from 'classnames';
import { capitalize } from 'lodash';

export const Button = (props: IButtonProps) => {
    const {
        label,
        title,
        children,
        variant = 'contained',
        color = 'primary',
        size = 'medium',
        disabled,
        onClick,
    } = props;
    const classnames = cn(
        styles.buttonWrapper,
        styles[`${variant}${capitalize(color)}`],
        styles[`${size}`],
        {
            [styles.disabled]: disabled,
        },
    );

    return (
        <button className={classnames} title={title} onClick={onClick}>
            {children ?? label}
        </button>
    );
};
