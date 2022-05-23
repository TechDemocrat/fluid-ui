import React, { ReactNode } from 'react';
import cn from 'classnames';
import { PlayerFullScreenControls } from '../../PlayerControls/components/PlayerFullScreenControls';
import { PlayerSettings } from '../../PlayerControls/components/PlayerSettings';
import { PlayerTimer } from '../../PlayerControls/components/PlayerTimer';
import { PlayerPlayPause } from '../../PlayerControls/components/PlayerPlayPause';
import styles from '../PhotoViewer.module.scss';

interface IPhotoViewerControlsProps {
    children: ReactNode;
    showPlayerControls: boolean;
}

export const PhotoViewerControls = (props: IPhotoViewerControlsProps) => {
    // props
    const { children, showPlayerControls } = props;

    // handlers
    const onPlayPauseClickHandler = () => {};

    const onFullScreenClickHandler = () => {};

    // paint
    return (
        <div className={styles.photoViewerControls}>
            <div
                className={cn(styles.photoViewerControlsActions, {
                    [styles.photoViewerControlsActionsVisible]: showPlayerControls,
                })}
            >
                <PlayerPlayPause
                    playPause={{ isPlaying: false, onClick: onPlayPauseClickHandler }}
                />
                <PlayerTimer current={1} total={1} />
            </div>
            {children}
            <div
                className={cn(styles.photoViewerControlsActions, {
                    [styles.photoViewerControlsActionsVisible]: showPlayerControls,
                })}
            >
                <PlayerSettings />
                <PlayerFullScreenControls
                    fullScreen={{ isFullScreen: false, onClick: onFullScreenClickHandler }}
                />
            </div>
        </div>
    );
};
