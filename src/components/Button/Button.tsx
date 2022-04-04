import React from 'react';
import { IButtonProps } from './Button.types';
import styles from './Button.module.scss';
import cn from 'classnames';
import { capitalize } from 'lodash';
import { useTheme } from '../ThemeProvider/ThemeProvider';

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

    const { theme } = useTheme();
    console.log(theme);

    // compute
    const classnames = cn(
        styles.buttonWrapper,
        styles[`${variant}${capitalize(color)}`],
        styles[`${size}`],
        {
            [styles.disabled]: disabled,
        },
    );

    // paint
    return (
        <button className={classnames} title={title} onClick={onClick}>
            {children ?? label}
        </button>
    );
};
