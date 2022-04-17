import React from 'react';
import cn from 'classnames';

import { ITimeFromNowProps } from './TimeFromNow.types';
import styles from './TimeFromNow.module.scss';
import { TimeFromNowService } from './TimeFromNow.service';

export const TimeFromNow = (props: ITimeFromNowProps) => {
    // props
    const { size = 'small', className } = props;
    let { dateString = new Date().toISOString() } = props;

    // compute
    if (!dateString) {
        dateString = new Date().toISOString();
    }
    const formattedDate = TimeFromNowService.getTimeFromNow(dateString);

    // paint
    return (
        <span
            className={cn(
                styles.wrapper,
                {
                    [styles.small]: size === 'small',
                    [styles.medium]: size === 'medium',
                },
                className,
            )}
        >
            {formattedDate}
        </span>
    );
};
