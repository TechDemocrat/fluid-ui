import { IconifyIcon } from '@iconify/types';
import { EContentType } from './ContentTypeFlag.types';
import {
    baselineVideocam,
    baselineCameraAlt,
    baselineHeadphones,
    baselinePodcasts,
    baselineRssFeed,
} from '../../assets/icons/iconify';
import { IThemeColors } from '../ThemeProvider/ThemeProvider.types';

interface IContentTypeMeta {
    label: string;
    icon: IconifyIcon;
    color: string;
}

export class ContentTypeFlagService {
    public static getContentTypeMeta(
        themeColors: IThemeColors,
        type: EContentType,
    ): IContentTypeMeta {
        const meta: IContentTypeMeta = {
            label: '',
            color: '',
            icon: null as unknown as IconifyIcon,
        };
        switch (type) {
            case EContentType.BLOG:
                meta.label = 'Blog';
                meta.icon = baselineRssFeed;
                meta.color = themeColors.contentBlog;
                break;
            case EContentType.MUSIC:
                meta.label = 'Music';
                meta.icon = baselineHeadphones;
                meta.color = themeColors.contentMusic;
                break;
            case EContentType.PODCAST:
                meta.label = 'Podcast';
                meta.icon = baselinePodcasts;
                meta.color = themeColors.contentPodcast;
                break;
            case EContentType.PHOTO:
                meta.label = 'Photo';
                meta.icon = baselineCameraAlt;
                meta.color = themeColors.contentPhoto;
                break;
            case EContentType.VIDEO:
            default:
                meta.label = 'Video';
                meta.icon = baselineVideocam;
                meta.color = themeColors.contentVideo;
                break;
        }

        return meta;
    }
}
