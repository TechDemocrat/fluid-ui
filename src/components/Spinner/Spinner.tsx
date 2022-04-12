import React from 'react';
import cn from 'classnames';

import { ISpinnerProps } from './Spinner.types';
import styles from './Spinner.module.scss';
// import { SpinnerService } from './Spinner.service';

export const Spinner = (props: ISpinnerProps) => {
    // props
    const { size = 'medium', color = 'primary' } = props;

    // paint
    return (
        <div className={cn(styles.wrapper)}>
            <div
                className={cn(styles.spinner, {
                    // sizes
                    [styles.small]: size === 'small',
                    [styles.medium]: size === 'medium',
                    [styles.large]: size === 'large',
                    // colors
                    [styles.primary]: color === 'primary',
                    [styles.secondary]: color === 'secondary',
                })}
            />
        </div>
    );
};
