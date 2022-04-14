import React from 'react';
import cn from 'classnames';

import { IContentTitleWithActionProps } from './ContentTitleWithAction.types';
import styles from './ContentTitleWithAction.module.scss';
import { ContentTitleWithActionService } from './ContentTitleWithAction.service';
import { ContentTypeFlag } from '../ContentTypeFlag/ContentTypeFlag';
import { ContentActionGroup } from '../ContentActionGroup/ContentActionGroup';
import { TimeFromNow } from '../TimeFromNow/TimeFromNow';

export const ContentTitleWithAction = (props: IContentTitleWithActionProps) => {
    // props
    const { title, contentActionGroupOptions, duration, publishedAt, contentType } = props;

    // compute
    const formattedDuration = ContentTitleWithActionService.getFormattedDuration(
        contentType,
        duration,
    );

    // paint
    return (
        <div className={cn(styles.wrapper)}>
            <div className={styles.contentTitleTypeWrapper}>
                <h5>{title}</h5>
                <ContentTypeFlag type={contentType} />
            </div>
            <div className={styles.contentMetaActionWrapper}>
                <div className={styles.contentMetaWrapper}>
                    <TimeFromNow dateString={publishedAt} size="medium" />
                    {formattedDuration && (
                        <>
                            <span>|</span>
                            <span>{formattedDuration}</span>
                        </>
                    )}
                </div>
                <ContentActionGroup options={contentActionGroupOptions} />
            </div>
        </div>
    );
};
