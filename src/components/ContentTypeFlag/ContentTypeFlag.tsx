import React from 'react';
import { IContentTypeFlagProps } from './ContentTypeFlag.types';
import styles from './ContentTypeFlag.module.scss';
import cn from 'classnames';

export const ContentTypeFlag = (props: IContentTypeFlagProps) => {
    const { title } = props;

    return <div className={cn(styles.wrapper)} title={title}></div>;
};
