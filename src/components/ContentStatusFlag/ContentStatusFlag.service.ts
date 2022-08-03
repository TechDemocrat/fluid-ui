import { IThemeColors } from '../ThemeProvider/ThemeProvider.types';
import { EContentStatusType } from './ContentStatusFlag.types';

interface IContentStatusFlagMeta {
    label: string;
    color: string;
}

export class ContentStatusFlagService {
    static getContentStatusFlagMeta = (
        themeColors: IThemeColors,
        type: EContentStatusType,
    ): IContentStatusFlagMeta => {
        const meta: IContentStatusFlagMeta = {
            label: '',
            color: '',
        };
        switch (type) {
            case EContentStatusType.ON_AIR:
                meta.label = 'On Air';
                meta.color = themeColors.success;
                break;
            case EContentStatusType.UPLOADING:
                meta.label = 'Uploading';
                meta.color = themeColors.infoDark;
                break;
            case EContentStatusType.SCHEDULED:
                meta.label = 'Scheduled';
                meta.color = themeColors.info;
                break;
            case EContentStatusType.UNPUBLISHED:
                meta.label = 'Unpublished';
                meta.color = themeColors.danger;
                break;
            case EContentStatusType.DRAFT:
            default:
                meta.label = 'Draft';
                meta.color = themeColors.warning;
                break;
        }

        return meta;
    };
}
