import React, { CSSProperties } from 'react';
import cn from 'classnames';

import { IContentThumbnailProps } from './ContentThumbnail.types';
import styles from './ContentThumbnail.module.scss';
// import { ContentThumbnailService } from './ContentThumbnail.service';
import { ContentStatusFlag } from '../ContentStatusFlag/ContentStatusFlag';
import { ContentTypeFlag } from '../ContentTypeFlag/ContentTypeFlag';
import { TimeFromNow } from '../TimeFromNow/TimeFromNow';

export const ContentThumbnail = (props: IContentThumbnailProps) => {
    // props
    const { type, status, publishedTime, duration, title, thumbnailUrl, onClick } = props;

    // compute

    // styles
    const imageHolderStyle: CSSProperties = {
        backgroundImage: `url(${thumbnailUrl})`,
    };

    // paint
    return (
        <div className={cn(styles.wrapper)} onClick={onClick}>
            <div className={styles.thumbnailImageWrapper}>
                <div className={styles.imageHolder} style={imageHolderStyle} />
                <div className={styles.contentTypeFlagWrapper}>
                    <ContentTypeFlag type={type} />
                </div>
                {duration && <div className={styles.contentTimerWrapper}>{duration}</div>}
            </div>
            <div className={styles.contentMeta}>
                <div className={styles.contentTitle} title={title}>
                    {title}
                </div>
                <div className={styles.contentInfoWrapper}>
                    <TimeFromNow dateString={publishedTime} />
                    {status && (
                        <div className={styles.contentStatusFlagWrapper}>
                            <ContentStatusFlag type={status} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
