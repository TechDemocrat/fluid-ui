import { MouseEventHandler } from 'react';

export interface IContentActionGroupOptions {
    love: {
        active: boolean;
        onClick: MouseEventHandler<HTMLDivElement>;
    };
    comment: {
        onClick: MouseEventHandler<HTMLDivElement>;
    };
    share: {
        onClick: MouseEventHandler<HTMLDivElement>;
    };
    reply: {
        onClick: MouseEventHandler<HTMLDivElement>;
    };
}

export interface IContentActionGroupProps {
    /**
     * @default 'medium'
     **/
    size?: 'small' | 'medium';
    /**
     * order of the render  will be based on the order of the keys in the object
     */
    options: Partial<IContentActionGroupOptions>;
}
