import React from 'react';
import cn from 'classnames';

import { ITemplateProps } from './Template.types';
import styles from './Template.module.scss';
import { TemplateService } from './Template.service';

export const Template = (props: ITemplateProps) => {
    // props
    const { title } = props;

    // compute
    const originalTitle = TemplateService.getTitle(title);

    // paint
    return <div className={cn(styles.wrapper)}>{originalTitle}</div>;
};
