import React from 'react';
import cn from 'classnames';
import styles from '../PlayerControls.module.scss';
import { Icon } from '@iconify/react';
import { IPlayerControlsProps } from '../PlayerControls.types';
import { baselineFullscreen, baselineFullscreenExit } from '../../../utilities/icons/iconify';

export const FullscreenControls = (props: { fullscreen: IPlayerControlsProps['fullscreen'] }) => {
    // props
    const {
        fullscreen: { isFullscreen, isDisabled, onClick },
    } = props;

    // compute
    const currentIcon = isFullscreen ? baselineFullscreenExit : baselineFullscreen;

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
