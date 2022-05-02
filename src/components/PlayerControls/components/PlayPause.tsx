import React from 'react';
import cn from 'classnames';
import { Icon } from '@iconify/react';
import styles from '../PlayerControls.module.scss';
import { baselinePlayArrow, baselinePause } from '../../../utilities/icons/iconify';
import { IPlayerControlsProps } from '../PlayerControls.types';

export const PlayPause = (props: { playPause: IPlayerControlsProps['playPause'] }) => {
    // props
    const {
        playPause: { isPlaying, isDisabled, onClick },
    } = props;

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
