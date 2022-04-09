import React from 'react';
import cn from 'classnames';

import { IContentStatusFlagProps } from './ContentStatusFlag.types';
import styles from './ContentStatusFlag.module.scss';
import { ContentStatusFlagService } from './ContentStatusFlag.service';

export const ContentStatusFlag = (props: IContentStatusFlagProps) => {
    // props
    const { title } = props;

    // compute
    const originalTitle = ContentStatusFlagService.getTitle(title);

    // paint
    return <div className={cn(styles.wrapper)}>{originalTitle}</div>;
};
