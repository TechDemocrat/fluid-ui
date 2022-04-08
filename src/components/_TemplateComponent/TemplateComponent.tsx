import React from 'react';
import { ITemplateComponentProps } from './TemplateComponent.types';
import styles from './TemplateComponent.module.scss';
import cn from 'classnames';

export const TemplateComponent = (props: ITemplateComponentProps) => {
    const { title } = props;

    return <div className={cn(styles.wrapper)} title={title}></div>;
};
