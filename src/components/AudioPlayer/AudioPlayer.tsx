import React, { ReactEventHandler, SyntheticEvent, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import styles from './AudioPlayer.module.scss';
import videoStyles from '../VideoPlayer/VideoPlayer.module.scss';
import { AudioPlayerPoster } from './components/AudioPlayerPoster';
import { IAudioPlayerProps } from './AudioPlayer.types';
import { PlayerControls } from '../PlayerControls/PlayerControls';
import { IPlayerControlsProps, TvolumeState } from '../PlayerControls/PlayerControls.types';
import {
    useClickHandler,
    useIsKeyboardIdle,
    useIsMouseIdle,
    useLocalStorage,
} from '../../utilities/cutomHooks';
import { PlayerControlsService } from '../PlayerControls/PlayerControls.service';
import {
    PlayerAccessibilityLayer,
    TAccessibilityType,
} from '../VideoPlayer/components/PlayerAccesibilityLayer';
import { VideoPlayerService } from '../VideoPlayer/VideoPlayer.service';
import { TVolumeHandlerType } from '../VideoPlayer/VideoPlayer.types';
import { UnderlayGradientContainer } from '../VideoPlayer/components/UnderlayGradientContainer';

export const AudioPlayer = (props: IAudioPlayerProps) => {
    // props
    const {
        source = { src: '', type: '', title: '', poster: '' },
        autoPlay = true,
        actionGroupOptions = {},
    } = props;

    // refs
    const audioPlayerWrapperRef = useRef<HTMLDivElement>(null);
    const audioPlayerRef = useRef<HTMLAudioElement>(null);

    // state
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [duration, setDuration] = useState(0);
    const [bufferedDuration, setBufferedDuration] = useState(0);
    const [isAudioReady, setIsAudioReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [accessiblityActionType, setAccessiblityActionType] = useState<TAccessibilityType>(null);

    // custom hooks
    const [volume, setVolume] = useLocalStorage<TvolumeState>(
        'volume',
        PlayerControlsService.getDefaultVolumeState(),
    );
    const isMouseIdle = useIsMouseIdle(audioPlayerWrapperRef);
    const isKeyboardIdle = useIsKeyboardIdle();

    // effects
    // volume handler effect
    useEffect(() => {
        if (audioPlayerRef.current) {
            audioPlayerRef.current.volume = volume.currentLevel / 100;
        }
    }, [isAudioReady, duration, volume.currentLevel, volume.isMuted, volume.previousLevel]);

    // play pause handler effect
    useEffect(() => {
        if (audioPlayerRef.current && isAudioReady) {
            if (isPlaying) {
                audioPlayerRef.current.play().catch(() => {
                    setIsPlaying(false);
                });
            } else {
                audioPlayerRef.current.pause();
            }
        }
    }, [isAudioReady, isPlaying]);

    // fullScreen handler effect
    useEffect(() => {
        const audioPlayerWrapper = audioPlayerWrapperRef.current;
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
            audioPlayerWrapper?.addEventListener('fullscreenchange', handleFullScreenChange);
            audioPlayerWrapper?.requestFullscreen().catch(() => {
                setIsFullScreen(false);
            });
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
        }

        return () => {
            audioPlayerWrapper?.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, [isFullScreen]);

    // handlers
    const onBufferUpdate = (e: SyntheticEvent<HTMLAudioElement, Event>) => {
        const currentBufferedDuration = VideoPlayerService.getBufferedDuration(e);
        setBufferedDuration(currentBufferedDuration);
    };

    const onLoadedData: ReactEventHandler<HTMLAudioElement> = (e) => {
        if (e.currentTarget.readyState >= 2) {
            const currentDuration = e.currentTarget.duration;
            setDuration(currentDuration);
            setIsAudioReady(true);
            setIsLoading(false);
            onBufferUpdate(e);
        }
    };

    const onPlayPauseClick = () => {
        setIsPlaying(!isPlaying);
        setAccessiblityActionType(isPlaying ? 'pause' : 'play');
    };

    const onTimeUpdate: ReactEventHandler<HTMLAudioElement> = (e) => {
        setCurrentTime(e.currentTarget.currentTime);
    };

    const onProgressChange: IPlayerControlsProps['progress']['onProgressChange'] = (newTime) => {
        if (audioPlayerRef.current) audioPlayerRef.current.currentTime = newTime;
    };

    const onProgressDragStart = () => {
        if (audioPlayerRef.current) audioPlayerRef.current.pause();
    };

    const onProgressDragEnd = () => {
        if (audioPlayerRef.current && isPlaying)
            audioPlayerRef.current.play().catch(() => {
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

    const onAudioEnded = () => {
        setIsPlaying(false);
    };

    const onAudioWaiting = () => {
        setIsLoading(true);
    };

    const onAudioPlaying = () => {
        setIsLoading(false);
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
            fastForwardBackwardSpeed: 5,
            bufferedDuration,
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

    const isUserInteracting = !(isMouseIdle && isKeyboardIdle);
    const showPlayerControls = isUserInteracting;

    // paint
    return (
        <div
            className={cn(styles.wrapper, videoStyles.wrapper, {
                [videoStyles.hideCursor]: isMouseIdle,
            })}
            ref={audioPlayerWrapperRef}
            onClick={onAccessibilityLayerClick}
        >
            <audio
                className={cn(videoStyles.playerCore)}
                ref={audioPlayerRef}
                controls={false} // override default controls
                crossOrigin="anonymous"
                preload="auto" // Indicates that the whole audio file can be downloaded, even if the user is not expected to use it.
                autoPlay={autoPlay}
                onLoadedData={onLoadedData}
                onTimeUpdate={onTimeUpdate}
                onProgress={onBufferUpdate}
                onEnded={onAudioEnded}
                onWaiting={onAudioWaiting}
                onPlaying={onAudioPlaying}
            >
                <source src={source.src} type={source.type} />
                Your browser does not support the audio tag.
            </audio>
            <AudioPlayerPoster
                source={source}
                actionGroupOptions={actionGroupOptions}
                isFullScreen={isFullScreen}
            />

            <PlayerControls
                className={cn(videoStyles.playerControls, {
                    [videoStyles.showPlayerControls]: showPlayerControls,
                })}
                {...playerControlsProps}
            />
            <UnderlayGradientContainer position="bottom" show={showPlayerControls} />

            <PlayerAccessibilityLayer
                actionType={accessiblityActionType}
                seekSpeed={playerControlsProps.progress.fastForwardBackwardSpeed}
                isLoading={isLoading}
                isFullScreen={isFullScreen}
                setActionType={setAccessiblityActionType}
            />
        </div>
    );
};
