import React from 'react';
import cn from 'classnames';
import styles from '../VideoPlayer.module.scss';

interface IUnderlayGradientContainerProps {
    position: 'top' | 'bottom';
    show: boolean;
}

export const UnderlayGradientContainer = (props: IUnderlayGradientContainerProps) => {
    // props
    const { position, show } = props;

    // paint
    return (
        <div
            className={cn(
                styles.underlayGradientContainer,
                {
                    [styles.gradientTop]: position === 'top',
                    [styles.gradientBottom]: position === 'bottom',
                },
                {
                    [styles.showGradient]: show,
                },
            )}
        />
    );
};
