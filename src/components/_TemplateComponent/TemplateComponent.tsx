import React from 'react';
import cn from 'classnames';

import { ITemplateComponentProps } from './TemplateComponent.types';
import styles from './TemplateComponent.module.scss';
import { TempalteComponentService } from './TemplateComponent.service';

export const TemplateComponent = (props: ITemplateComponentProps) => {
    // props
    const { title } = props;

    // compute
    const originalTitle = TempalteComponentService.getTitle(title);

    // paint
    return <div className={cn(styles.wrapper)}>{originalTitle}</div>;
};
