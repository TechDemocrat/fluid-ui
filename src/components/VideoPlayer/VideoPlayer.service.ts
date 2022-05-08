import { TvolumeState } from './VideoPlayer.types';

export class VideoPlayerService {
    // gives volume state object for different actions
    static getVolumeState =
        <T extends 'onChange' | 'onMute' | 'onUnMute'>(volume: TvolumeState, type: T) =>
        (newLevel?: number): TvolumeState => {
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
}
