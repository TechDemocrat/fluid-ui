import React from 'react';
import cn from 'classnames';
import styles from '../PlayerControls.module.scss';
import { Icon } from '@iconify/react';
import { IPlayerControlsProps } from '../PlayerControls.types';
import { baselineFullScreen, baselineFullScreenExit } from '../../../assets/icons/iconify';
import { useEventListener } from '../../../hooks';

interface IPlayerFullScreenControlsProps {
    fullScreen: IPlayerControlsProps['fullScreen'];
}

export const PlayerFullScreenControls = (props: IPlayerFullScreenControlsProps) => {
    // props
    const {
        fullScreen: { isFullScreen: isFullScreen, isDisabled, onClick },
    } = props;

    // handlers
    const onKeyDown = (e: WindowEventMap['keydown']) => {
        // on f key press toggle full screen
        if (e.key === 'f') {
            onClick();
        }
    };

    // hooks
    useEventListener('keydown', onKeyDown, true);

    // compute
    const currentIcon = isFullScreen ? baselineFullScreenExit : baselineFullScreen;

    // paint
    return (
        <div>
            <Icon
                icon={currentIcon}
                className={cn(styles.actionIcon, styles.fullScreenIcon, {
                    [styles.iconDisabled]: isDisabled,
                })}
                onClick={onClick}
            />
        </div>
    );
};
