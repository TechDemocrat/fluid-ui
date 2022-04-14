import { IContentActionGroupOptions } from '../ContentActionGroup/ContentActionGroup.types';
import { EContentType } from '../ContentTypeFlag/ContentTypeFlag.types';

export interface IContentTitleWithActionProps {
    title: string;
    /**
     * Order of the key corresponds the order of the action group
     */
    contentActionGroupOptions: Required<
        Pick<IContentActionGroupOptions, 'love' | 'comment' | 'share'>
    >;
    contentType: EContentType;
    /**
     * Should be a date string
     * @example '2022-04-14T06:35:20.907Z
     */
    publishedAt: string;
    /**
     * should be in minutes
     * @example '10:40'
     */
    duration?: string;
}
