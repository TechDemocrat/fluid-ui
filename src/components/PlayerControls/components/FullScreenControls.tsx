import React from 'react';
import cn from 'classnames';
import styles from '../PlayerControls.module.scss';
import { Icon } from '@iconify/react';
import { IPlayerControlsProps } from '../PlayerControls.types';
import { baselineFullScreen, baselineFullScreenExit } from '../../../utilities/icons/iconify';

export const FullScreenControls = (props: { fullScreen: IPlayerControlsProps['fullScreen'] }) => {
    // props
    const {
        fullScreen: { isFullScreen: isFullScreen, isDisabled, onClick },
    } = props;

    // compute
    const currentIcon = isFullScreen ? baselineFullScreenExit : baselineFullScreen;

    // paint
    return (
        <Icon
            icon={currentIcon}
            className={cn(styles.actionIcon, {
                [styles.iconDisabled]: isDisabled,
            })}
            onClick={onClick}
        />
    );
};
