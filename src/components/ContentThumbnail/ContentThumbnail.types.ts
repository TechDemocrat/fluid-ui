import { EContentStatusType } from '../ContentStatusFlag/ContentStatusFlag.types';
import { EContentType } from '../ContentTypeFlag/ContentTypeFlag.types';

export interface IContentThumbnailProps {
    type: EContentType;
    title: string;
    publishedTime: string;
    thumbnailUrl: string;
    duration?: string;
    status?: EContentStatusType;
    onClick?: () => void;
}
