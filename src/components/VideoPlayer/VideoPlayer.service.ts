import { SyntheticEvent } from 'react';
import { TVolumeState } from '../PlayerControls/PlayerControls.types';

export class VideoPlayerService {
    // gives volume state object for different actions
    static getVolumeState =
        <T extends 'onChange' | 'onMute' | 'onUnMute'>(volume: TVolumeState, type: T) =>
        (newLevel?: number): TVolumeState => {
            const previousLevel = volume.currentLevel > 10 ? volume.currentLevel : 10; // minimum volume threshold
            if (type === 'onMute') {
                return {
                    currentLevel: 0,
                    previousLevel,
                    isMuted: true,
                };
            } else if (type === 'onUnMute') {
                return {
                    currentLevel: volume.previousLevel,
                    previousLevel,
                    isMuted: false,
                };
            }

            return {
                currentLevel: newLevel ?? 0,
                previousLevel,
                isMuted: newLevel === 0,
            };
        };

    static getBufferedDuration = (
        e: SyntheticEvent<HTMLVideoElement | HTMLAudioElement, Event>,
    ): number => {
        const videoElement = e.currentTarget;
        const duration = videoElement.duration;
        if (duration > 0 && videoElement.buffered.length > 0) {
            const currentBufferedDuration = videoElement.buffered.end(
                videoElement.buffered.length - 1,
            );
            return currentBufferedDuration || 0;
        }
        return 0;
    };
}
