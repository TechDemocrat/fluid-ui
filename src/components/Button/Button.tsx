import React from 'react';
import { IButtonProps } from './Button.types';
import styles from './Button.module.scss';
import cn from 'classnames';
import { capitalize } from 'lodash';

export const Button = (props: IButtonProps) => {
    // props
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

    // compute
    const classnames = cn(
        styles.buttonWrapper,
        styles[`${variant}${capitalize(color)}`],
        styles[`${size}`],
        {
            [styles.disabled]: disabled,
            [styles.containedOutlined]: variant === 'contained',
        },
    );

    // paint
    return (
        <button className={classnames} title={title} onClick={onClick}>
            {children ?? label}
        </button>
    );
};
