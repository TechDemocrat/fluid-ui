import React from 'react';
import cn from 'classnames';

import { ITimeFromNowProps } from './TimeFromNow.types';
import styles from './TimeFromNow.module.scss';
import { TimeFromNowService } from './TimeFromNow.service';

export const TimeFromNow = (props: ITimeFromNowProps) => {
    // props
    const { dateString, className } = props;

    // compute
    const formattedDate = TimeFromNowService.getTimeFromNow(dateString);

    // paint
    return <div className={cn(styles.wrapper, className)}>{formattedDate}</div>;
};
