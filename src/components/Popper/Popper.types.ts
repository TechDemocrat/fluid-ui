import { ReactNode } from 'react';

export interface IPopperProps {
    title: string;
    content: (props: { onClose?: () => void }) => ReactNode;
    children: (props: {
        onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
        onHover?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    }) => ReactNode;
}
