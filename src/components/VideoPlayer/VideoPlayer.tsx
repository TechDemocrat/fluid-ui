import React, { ReactEventHandler, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import styles from './VideoPlayer.module.scss';
import { IVideoPlayerProps, TVolumeHandlerType, TvolumeState } from './VideoPlayer.types';
import { PlayerControls } from '../PlayerControls/PlayerControls';
import { IPlayerControlsProps } from '../PlayerControls/PlayerControls.types';
import { useClickHandler, useIsMouseIdle, useLocalStorage } from '../../utilities/cutomHooks';
import { VideoPlayerService } from './VideoPlayer.service';
import { FullScreenVideoTitleWithAction } from './components/FullScreenVideoTitleWithAction';
import { UnderlayGradientContainer } from './components/UnderlayGradientContainer';
import { PlayerAccessibilityLayer, TAccessibilityType } from './components/PlayerAccesibilityLayer';

export const VideoPlayer = (props: IVideoPlayerProps) => {
    // props
    const {
        source = { src: '', type: '', title: '' },
        autoPlay = true,
        poster,
        actionGroupOptions,
    } = props;
    const { title } = source;

    // refs
    const videoPlayerWrapperRef = useRef<HTMLDivElement>(null);
    const videoPlayerRef = useRef<HTMLVideoElement>(null);

    // state
    const [currentTime, setCurrentTime] = useState(0);
    const [, setIsLoading] = useState(true);
    const [duration, setDuration] = useState(0);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [accessiblityActionType, setAccessiblityActionType] = useState<TAccessibilityType>(null);

    // custom hooks
    const [volume, setVolume] = useLocalStorage<TvolumeState>('volume', {
        currentLevel: 50,
        previousLevel: 50,
        isMuted: false,
    });
    const isMouseIdle = useIsMouseIdle(videoPlayerWrapperRef);

    // effects
    // volume handler effect
    useEffect(() => {
        if (videoPlayerRef.current) {
            videoPlayerRef.current.volume = volume.currentLevel / 100;
        }
    }, [isVideoReady, duration, volume.currentLevel, volume.isMuted, volume.previousLevel]);

    // play pause handler effect
    useEffect(() => {
        if (videoPlayerRef.current && isVideoReady) {
            if (isPlaying) {
                videoPlayerRef.current.play().catch(() => {
                    setIsPlaying(false);
                });
            } else {
                videoPlayerRef.current.pause();
            }
        }
    }, [isVideoReady, isPlaying]);

    // fullScreen handler effect
    useEffect(() => {
        const videPlayerWrapper = videoPlayerWrapperRef.current;
        const handleFullScreenChange = () => {
            // document.fullScreenElement will point to the element that
            // is in fullScreen mode if there is one. If not, the value
            // of the property is null.
            if (document.fullscreenElement) {
                // Entered fullScreen mode.
            } else {
                // Leaving fullScreen mode
                setIsFullScreen(false);
            }
        };

        if (isFullScreen) {
            videPlayerWrapper?.addEventListener('fullscreenchange', handleFullScreenChange);
            videPlayerWrapper?.requestFullscreen().catch(() => {
                setIsFullScreen(false);
            });
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
        }

        return () => {
            videPlayerWrapper?.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, [isFullScreen]);

    // handlers
    const onLoadedData: ReactEventHandler<HTMLVideoElement> = (e) => {
        if (e.currentTarget.readyState >= 2) {
            const currentDuration = e.currentTarget.duration;
            setDuration(currentDuration);
            setIsVideoReady(true);
            setIsLoading(false);
        }
    };

    const onPlayPauseClick = () => {
        setIsPlaying(!isPlaying);
    };

    const onTimeUpdate: ReactEventHandler<HTMLVideoElement> = (e) => {
        setCurrentTime(e.currentTarget.currentTime);
    };

    const onProgressChange: IPlayerControlsProps['progress']['onProgressChange'] = (newTime) => {
        if (videoPlayerRef.current) videoPlayerRef.current.currentTime = newTime;
    };

    const onProgressDragStart = () => {
        if (videoPlayerRef.current) videoPlayerRef.current.pause();
    };

    const onProgressDragEnd = () => {
        if (videoPlayerRef.current && isPlaying)
            videoPlayerRef.current.play().catch(() => {
                setIsPlaying(false);
            });
    };

    const volumeHandler =
        <T extends TVolumeHandlerType>(type: T) =>
        (newLevel?: number) =>
            setVolume(VideoPlayerService.getVolumeState(volume, type)(newLevel));

    const onFullScreenClick = () => {
        setIsFullScreen(!isFullScreen);
    };

    const onAccessibilityLayerClick = useClickHandler({
        onSingleClick: onPlayPauseClick,
        onDoubleClick: onFullScreenClick,
    });

    // compute
    const playerControlsProps = {
        progress: {
            current: currentTime,
            total: duration,
            fastForwardBackwardSpeed: 10,
            onProgressChange,
            onProgressDragStart,
            onProgressDragEnd,
        },
        volume: {
            ...volume,
            onChange: volumeHandler('onChange'),
            onMute: volumeHandler('onMute'),
            onUnMute: volumeHandler('onUnMute'),
        },
        playPause: {
            isPlaying,
            onClick: onPlayPauseClick,
        },
        fullScreen: {
            isFullScreen,
            onClick: onFullScreenClick,
        },
        setAccessiblityActionType,
    } as IPlayerControlsProps;

    const showTitleWithAction = isFullScreen && !isMouseIdle;
    const showPlayerControls = !isMouseIdle;

    // paint
    return (
        <div
            className={cn(styles.wrapper, {
                [styles.hideCursor]: isMouseIdle,
            })}
            ref={videoPlayerWrapperRef}
        >
            <FullScreenVideoTitleWithAction
                title={title}
                actionGroupOptions={actionGroupOptions}
                show={showTitleWithAction}
            />
            <UnderlayGradientContainer position="top" show={showTitleWithAction} />

            <video
                className={cn(styles.video)}
                ref={videoPlayerRef}
                controls={false} // override default controls
                crossOrigin="anonymous"
                poster={poster}
                preload="auto" // Indicates that the whole video file can be downloaded, even if the user is not expected to use it.
                onLoadedData={onLoadedData}
                onTimeUpdate={onTimeUpdate}
                autoPlay={autoPlay}
            >
                <source src={source.src} type={source.type} />
                Your browser does not support the video tag.
            </video>

            <PlayerControls
                className={cn(styles.videoControls, {
                    [styles.showVideoControls]: showPlayerControls,
                })}
                {...playerControlsProps}
            />
            <UnderlayGradientContainer position="bottom" show={showPlayerControls} />

            <PlayerAccessibilityLayer
                onClick={onAccessibilityLayerClick}
                actionType={accessiblityActionType}
                setActionType={setAccessiblityActionType}
            />
        </div>
    );
};
