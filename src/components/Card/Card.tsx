import React from 'react';
import cn from 'classnames';

import { ICardProps } from './Card.types';
import styles from './Card.module.scss';

export const Card = (props: ICardProps) => {
    // props
    const { title, children } = props;

    // paint
    return (
        <div className={cn(styles.cardWrapper)}>
            <div className={cn(styles.cardTitle)}>{title}</div>
            <div className={cn(styles.cardBody)}>{children}</div>
        </div>
    );
};
