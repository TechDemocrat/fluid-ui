import React from 'react';
import { ILinkProps } from './Link.types';
import styles from './Link.module.scss';
import cn from 'classnames';

export const Link = (props: ILinkProps) => {
    const { href, label, title, children, disabled, onClick } = props;
    const classnames = cn(styles.linkWrapper, {
        [styles.disabled]: disabled,
    });

    return href ? (
        <a className={classnames} title={title} href={href}>
            {children ?? label}
        </a>
    ) : (
        <div className={classnames} role="button" onClick={onClick}>
            {children ?? label}
        </div>
    );
};
