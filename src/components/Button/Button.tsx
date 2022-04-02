import React from 'react';
import { IButtonProps } from './Button.types';
import styles from './Button.module.scss';

export const Button = (props: IButtonProps) => {
    const { label, title } = props;

    return (
        <button className={styles.buttonWrapper} title={title}>
            {label}
        </button>
    );
};
