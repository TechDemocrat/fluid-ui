import React, { Dispatch } from 'react';
import cn from 'classnames';
import { Icon } from '@iconify/react';
import styles from '../PlayerControls.module.scss';
import { baselinePlayArrow, baselinePause } from '../../../utilities/icons/iconify';
import { IPlayerControlsProps } from '../PlayerControls.types';
import { useEventListener } from '../../../utilities/cutomHooks';
import { TAccessibilityType } from '../../VideoPlayer/components/PlayerAccesibilityLayer';

export const PlayPause = (props: {
    playPause: IPlayerControlsProps['playPause'];
    setAccessiblityActionType: Dispatch<TAccessibilityType>;
}) => {
    // props
    const {
        playPause: { isPlaying, isDisabled, onClick },
        setAccessiblityActionType,
    } = props;

    // handlers
    const onKeyDown = (e: WindowEventMap['keydown']) => {
        // if space is pressed and player is not disabled then play/pause
        if (e.key === ' ' && !isDisabled) {
            onClick?.();
            setAccessiblityActionType(isPlaying ? 'pause' : 'play');
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
