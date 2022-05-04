import { TvolumeState } from './VideoPlayer.types';

export class VideoPlayerService {
    // gives volume state object for different actions
    static getVolumeState =
        <T extends 'onChange' | 'onMute' | 'onUnMute'>(volume: TvolumeState, type: T) =>
        (newLevel?: number): TvolumeState => {
            if (type === 'onMute') {
                return {
                    currentLevel: 0,
                    previousLevel: volume.currentLevel,
                    isMuted: true,
                };
            } else if (type === 'onUnMute') {
                return {
                    currentLevel: volume.previousLevel,
                    previousLevel: volume.previousLevel,
                    isMuted: false,
                };
            }

            return {
                currentLevel: newLevel ?? 0,
                previousLevel: volume.currentLevel,
                isMuted: false,
            };
        };
}
