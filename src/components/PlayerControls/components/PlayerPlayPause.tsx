import React from 'react';
import cn from 'classnames';
import { Icon } from '@iconify/react';
import styles from '../PlayerControls.module.scss';
import { baselinePlayArrow, baselinePause } from '../../../utilities/icons/iconify';
import { IPlayerControlsProps } from '../PlayerControls.types';
import { useEventListener } from '../../../utilities/cutomHooks';

export const PlayerPlayPause = (props: { playPause: IPlayerControlsProps['playPause'] }) => {
    // props
    const {
        playPause: { isPlaying, isDisabled, onClick },
    } = props;

    // handlers
    const onKeyDown = (e: WindowEventMap['keydown']) => {
        // if space is pressed and player is not disabled then play/pause
        if (e.key === ' ' && !isDisabled) {
            onClick?.();
        }
    };

    // hooks
    useEventListener('keydown', onKeyDown);

    // compute
    const currentIcon = isPlaying ? baselinePause : baselinePlayArrow;

    // paint
    return (
        <div>
            <Icon
                icon={currentIcon}
                className={cn(styles.actionIcon, styles.playPauseIcon, {
                    [styles.iconDisabled]: isDisabled,
                })}
                onClick={onClick}
            />
        </div>
    );
};
