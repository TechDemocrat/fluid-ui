import { IconifyIcon } from '@iconify/types';
import { EContentType } from './ContentTypeFlag.types';
import {
    baselineVideocam,
    baselineCameraAlt,
    baselineHeadphones,
    baselinePodcasts,
    baselineRssFeed,
} from '../../utilities/icons/Iconify/index';
import { IThemeColors } from '../ThemeProvider/ThemeProvider.types';

interface IContentTypeMeta {
    label: string;
    icon: IconifyIcon;
    color: string;
}

export class ContentTypeFlagService {
    public static getContentTypeMeta(
        themeColors: IThemeColors,
        type?: EContentType,
    ): IContentTypeMeta {
        console.log(typeof type, typeof EContentType.BLOG);
        switch (Number(type)) {
            case EContentType.BLOG: {
                console.log('hitis');
                return {
                    label: 'Blog',
                    icon: baselineRssFeed,
                    color: themeColors.contentBlog,
                };
            }
            case EContentType.MUSIC: {
                return {
                    label: 'Music',
                    icon: baselineHeadphones,
                    color: themeColors.contentMusic,
                };
            }
            case EContentType.PODCAST: {
                return {
                    label: 'Podcast',
                    icon: baselinePodcasts,
                    color: themeColors.contentPodcast,
                };
            }
            case EContentType.PHOTO: {
                return {
                    label: 'Photo',
                    icon: baselineCameraAlt,
                    color: themeColors.contentPhoto,
                };
            }
            case EContentType.VIDEO:
            default: {
                console.log('hits video');
                return {
                    label: 'Video',
                    icon: baselineVideocam,
                    color: themeColors.contentVideo,
                };
            }
        }
    }
}
