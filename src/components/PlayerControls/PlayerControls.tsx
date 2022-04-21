import React, { MouseEvent, useState } from 'react';
import cn from 'classnames';
import { Icon } from '@iconify/react';

import { IPlayerControlsProps } from './PlayerControls.types';
import styles from './PlayerControls.module.scss';
import { PlayerControlsService } from './PlayerControls.service';
import {
    baselinePlayArrow,
    // baselinePause,
    baselineRepeat,
    // baselineRepeatOne,
    baselineShuffle,
    baselineSkipPrevious,
    baselineSkipNext,
    baselineVolumeUp,
    // baselineVolumeDown,
    // baselineVolumeOff,
    baselineFullscreen,
    // baselineFullscreenExit,
    baselineSettings,
    baselineClosedCaption,
} from '../../utilities/icons/iconify';

export const PlayerControls = (props: IPlayerControlsProps) => {
    // props
    const {
        captions,
        fullscreen,
        next,
        playPause,
        previous,
        progress,
        repeat,
        settings,
        shuffle,
        volume,
    } = { ...PlayerControlsService.getInitialState(), ...props };

    // state
    const [progressHoverPercent, setProgressHoverPercent] = useState<number>(0);

    // handlers
    const onProgressMouseOver = (e: MouseEvent<HTMLDivElement>) =>
        setProgressHoverPercent(PlayerControlsService.getProgressHoverPercent(e));

    const onProgressMouseLeave = () => setProgressHoverPercent(0);

    // compute
    const { total, current } = PlayerControlsService.getFormattedDuration(progress);

    // paint
    return (
        <div className={cn(styles.wrapper)}>
            <div
                className={cn(styles.progressWrapper)}
                onMouseMove={onProgressMouseOver}
                onMouseOver={onProgressMouseOver}
                onMouseEnter={onProgressMouseOver}
                onMouseLeave={onProgressMouseLeave}
            >
                <div className={cn(styles.progress, styles.progressPadding)} />
                <div className={cn(styles.progress, styles.progressTrack)} />
                <div className={cn(styles.progress, styles.progressBar)} />
                <div className={cn(styles.progress, styles.progressHead)} />
                <div className={cn(styles.progress, styles.progressBuffer)} />
                <div
                    className={cn(styles.progress, styles.progressHover)}
                    style={{
                        width: `${progressHoverPercent * 100}%`,
                    }}
                />
            </div>
            <div className={cn(styles.controlsWrapper)}>
                <div className={cn(styles.controlsStartSectionWrapper)}>
                    <div className={cn(styles.durationWrapper)}>
                        <span>{current ?? '-'}</span>
                        <span>/</span>
                        <span>{total ?? '-'}</span>
                    </div>
                </div>
                <div className={cn(styles.controlsMiddleSectionWrapper)}>
                    <Icon
                        icon={baselineShuffle}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: shuffle.isDisabled,
                        })}
                        onClick={shuffle.onClick}
                    />
                    <Icon
                        icon={baselineRepeat}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: repeat.isDisabled,
                        })}
                        // onClick={repeat.onClick} // needs wrapper
                    />
                    <Icon
                        icon={baselineSkipPrevious}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: previous.isDisabled,
                        })}
                        onClick={previous.onClick}
                    />
                    <Icon
                        icon={baselinePlayArrow}
                        className={cn(styles.actionIcon, styles.playPauseIcon, {
                            [styles.iconDisabled]: playPause.isDisabled,
                        })}
                        onClick={playPause.onClick}
                    />
                    <Icon
                        icon={baselineSkipNext}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: next.isDisabled,
                        })}
                        onClick={next.onClick}
                    />
                    <Icon
                        icon={baselineClosedCaption}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: captions.isDisabled,
                        })}
                        onClick={captions.onClick}
                    />
                    <Icon
                        icon={baselineVolumeUp}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: volume.isDisabled,
                        })}
                        // onClick={volume.onClick} // needs wrapper
                    />
                </div>
                <div className={cn(styles.controlsEndSectionWrapper)}>
                    <Icon
                        icon={baselineSettings}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: settings.isDisabled,
                        })}
                    />
                    <Icon
                        icon={baselineFullscreen}
                        className={cn(styles.actionIcon, {
                            [styles.iconDisabled]: fullscreen.isDisabled,
                        })}
                        onClick={fullscreen.onClick}
                    />
                </div>
            </div>
        </div>
    );
};
