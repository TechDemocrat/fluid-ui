import React from 'react';
import { IContentStatusFlagProps } from './ContentStatusFlag.types';
import styles from './ContentStatusFlag.module.scss';
import cn from 'classnames';

export const ContentStatusFlag = (props: IContentStatusFlagProps) => {
    const { title } = props;

    return <div className={cn(styles.wrapper)} title={title}></div>;
};
