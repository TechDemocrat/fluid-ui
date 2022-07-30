import { ReactNode } from 'react';

export interface IPopperProps {
    content: (props: { onClose?: () => void }) => ReactNode;
    children: (props: {
        isOpen?: boolean;
        onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
        onHover?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    }) => ReactNode;
}
