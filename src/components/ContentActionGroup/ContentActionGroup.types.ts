import { MouseEventHandler } from 'react';

export interface IContentActionGroupOptions {
    love?: {
        active: boolean;
        onClick: MouseEventHandler<HTMLDivElement>;
    };
    comment?: {
        onClick: MouseEventHandler<HTMLDivElement>;
    };
    share?: {
        onClick: MouseEventHandler<HTMLDivElement>;
    };
    reply?: {
        onClick: MouseEventHandler<HTMLDivElement>;
    };
}

export interface IContentActionGroupProps {
    /**
     * @default 'medium'
     **/
    size?: 'small' | 'medium' | 'large';
    /**
     * order of the render  will be based on the order of the keys in the object
     */
    options: IContentActionGroupOptions;
    /**
     * @default 'primary'
     *
     * 'secondary' is used in video player - tweak styling with caution
     */
    theme?: 'primary' | 'secondary';
    /**
     * stop propagation helps to stop the event bubbling up to the parent element
     *
     * @default false
     */
    stopPropagation?: boolean;
}
