import { MouseEventHandler } from 'react';

export interface IIconButton {
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    onClick?: MouseEventHandler<HTMLDivElement>;
    title?: string;
    disabled?: boolean;
}
