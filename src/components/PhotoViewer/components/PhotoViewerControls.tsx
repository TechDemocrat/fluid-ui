import React, { MouseEvent, ReactNode } from 'react';
import cn from 'classnames';
import { PlayerFullScreenControls } from '../../PlayerControls/components/PlayerFullScreenControls';
import { PlayerSettings } from '../../PlayerControls/components/PlayerSettings';
import { PlayerTimer } from '../../PlayerControls/components/PlayerTimer';
import { PlayerPlayPause } from '../../PlayerControls/components/PlayerPlayPause';
import styles from '../PhotoViewer.module.scss';

interface IPhotoViewerControlsProps {
    children: ReactNode;
    showPlayerControls: boolean;
    isFullScreen: boolean;
    isPlaying: boolean;
    currentSourceIndex: number;
    sourceLength: number;
    progress: number;
    onPlayPauseClick: () => void;
    onFullScreenClick: () => void;
}

export const PhotoViewerControls = (props: IPhotoViewerControlsProps) => {
    // props
    const {
        children,
        showPlayerControls,
        isPlaying,
        isFullScreen,
        currentSourceIndex,
        sourceLength,
        progress,
        onPlayPauseClick,
        onFullScreenClick,
    } = props;

    // handlers
    const wrapperClickHandler = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation(); // this prevents the click event from bubbling up to the parent
    };

    const onPlayPauseClickHandler = () => onPlayPauseClick();

    const onFullScreenClickHandler = () => onFullScreenClick();

    // compute
    const isReachedEnd = currentSourceIndex === sourceLength - 1 && progress === 100;

    // paint
    return (
        <div className={styles.photoViewerControls} onClick={wrapperClickHandler}>
            <div
                className={cn(styles.photoViewerControlsActions, {
                    [styles.photoViewerControlsActionsVisible]: showPlayerControls,
                })}
            >
                <PlayerPlayPause
                    playPause={{ isPlaying, onClick: onPlayPauseClickHandler }}
                    isReachedEnd={isReachedEnd}
                />
                <PlayerTimer current={currentSourceIndex + 1} total={sourceLength} />
            </div>
            {children}
            <div
                className={cn(styles.photoViewerControlsActions, {
                    [styles.photoViewerControlsActionsVisible]: showPlayerControls,
                })}
            >
                <PlayerSettings />
                <PlayerFullScreenControls
                    fullScreen={{ isFullScreen, onClick: onFullScreenClickHandler }}
                />
            </div>
        </div>
    );
};
