import { EContentType } from '../ContentTypeFlag/ContentTypeFlag.types';

export class ContentTitleWithActionService {
    static getFormattedDuration = (
        contentType: EContentType,
        duration?: string,
    ): string | undefined => {
        if (!duration) return duration;

        const formattedDuration = [duration];

        switch (contentType) {
            case EContentType.VIDEO:
                formattedDuration.push('mins view');
                break;
            case EContentType.BLOG:
                formattedDuration.push('mins read');
                break;
            case EContentType.MUSIC:
            case EContentType.PODCAST:
                formattedDuration.push('mins listen');
                break;
            default:
                break;
        }
        return formattedDuration.join(' ');
    };
}
