import { IconifyIcon } from '@iconify/types';
import { EContentType } from './ContentTypeFlag.types';
import {
    baselineVideocam,
    baselineCameraAlt,
    baselineHeadphones,
    baselinePodcasts,
    baselineRssFeed,
} from '../../utilities/icons/iconify';
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
        switch (Number(type)) {
            case EContentType.BLOG: {
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
                return {
                    label: 'Video',
                    icon: baselineVideocam,
                    color: themeColors.contentVideo,
                };
            }
        }
    }
}
