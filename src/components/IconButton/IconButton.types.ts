import { MouseEventHandler } from 'react';

export interface IIconButton {
    children: React.ReactNode;
    padding?: number;
    onClick?: MouseEventHandler<HTMLDivElement>;
    title?: string;
    disabled?: boolean;
}
