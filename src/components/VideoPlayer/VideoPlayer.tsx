import React, { ReactEventHandler, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { IVideoPlayerProps } from './VideoPlayer.types';
import styles from './VideoPlayer.module.scss';
import { PlayerControls } from '../PlayerControls/PlayerControls';
import { IPlayerControlsProps } from '../PlayerControls/PlayerControls.types';
import { useLocalStorage } from '../../utilities/cutomHooks';
import { VideoPlayerService } from './VideoPlayer.service';

export const VideoPlayer = (props: IVideoPlayerProps) => {
    // props
    const { source = { src: '', type: '' }, autoPlay = true, poster } = props;

    // state
    const [currentTime, setCurrentTime] = useState(0);
    const [, setIsLoading] = useState(true);
    const [duration, setDuration] = useState(0);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [volume, setVolume] = useLocalStorage<
        Pick<IPlayerControlsProps['volume'], 'currentLevel' | 'previousLevel' | 'isMuted'>
    >('volume', { currentLevel: 50, previousLevel: 50, isMuted: false });

    // refs
    const videoPlayerRef = useRef<HTMLVideoElement>(null);

    // effects
    useEffect(() => {
        if (videoPlayerRef.current) {
            videoPlayerRef.current.volume = volume.currentLevel / 100;
        }
    }, [isVideoReady, duration, volume.currentLevel, volume.isMuted, volume.previousLevel]);

    // compute
    const onLoadedData: ReactEventHandler<HTMLVideoElement> = (e) => {
        if (e.currentTarget.readyState >= 2) {
            const currentDuration = e.currentTarget.duration;
            console.log('onLoadedData', currentDuration);
            setDuration(currentDuration);
            setIsVideoReady(true);
            setIsLoading(false);
            if (autoPlay) {
                videoPlayerRef.current?.play();
            }
        }
    };

    const onTimeUpdate: ReactEventHandler<HTMLVideoElement> = (e) => {
        setCurrentTime(e.currentTarget.currentTime);
    };

    const onManualProgressChange: IPlayerControlsProps['progress']['onProgressChange'] = (
        newTime,
    ) => {
        if (videoPlayerRef.current) videoPlayerRef.current.currentTime = newTime;
    };

    const volumeHandler =
        <T extends 'onChange' | 'onMute' | 'onUnMute'>(type: T) =>
        (newLevel?: number) =>
            setVolume(VideoPlayerService.getVolumeState(volume, type)(newLevel));

    const playerControlsProps = {
        progress: {
            current: currentTime,
            total: duration,
            fastForwardBackwardSpeed: 10,
            onProgressChange: onManualProgressChange,
        },
        volume: {
            ...volume,
            onChange: volumeHandler('onChange'),
            onMute: volumeHandler('onMute'),
            onUnMute: volumeHandler('onUnMute'),
        },
    } as IPlayerControlsProps;

    // paint
    return (
        <div className={cn(styles.wrapper)}>
            <video
                className={cn(styles.video)}
                ref={videoPlayerRef}
                controls={false} // override default controls
                crossOrigin="anonymous"
                poster={poster}
                preload="auto" // Indicates that the whole video file can be downloaded, even if the user is not expected to use it.
                onLoadedData={onLoadedData}
                onTimeUpdate={onTimeUpdate}
                loop // temp
            >
                <source src={source.src} type={source.type} />
                Your browser does not support the video tag.
            </video>
            <PlayerControls className={styles.videoControls} {...playerControlsProps} />
        </div>
    );
};
