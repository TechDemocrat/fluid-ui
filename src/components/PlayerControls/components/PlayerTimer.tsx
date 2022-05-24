import React from 'react';
import cn from 'classnames';
import styles from '../PlayerControls.module.scss';

export const PlayerTimer = (props: { current: string | number; total: string | number }) => {
    const { current, total } = props;

    // paint
    return (
        <div className={cn(styles.playerTimerWrapper)}>
            <span>{current ?? '-'}</span>
            <span>/</span>
            <span>{total ?? '-'}</span>
        </div>
    );
};
