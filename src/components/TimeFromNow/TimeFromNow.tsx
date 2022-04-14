import React from 'react';
import cn from 'classnames';

import { ITimeFromNowProps } from './TimeFromNow.types';
import styles from './TimeFromNow.module.scss';
import { TimeFromNowService } from './TimeFromNow.service';

export const TimeFromNow = (props: ITimeFromNowProps) => {
    // props
    const { dateString = new Date().toISOString(), size = 'small', className } = props;

    // compute
    const formattedDate = TimeFromNowService.getTimeFromNow(dateString);

    // paint
    return (
        <div
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
        </div>
    );
};
