export interface ITimeFromNowProps {
    /**
     * should be a date ISO string
     * @example '2022-04-14T06:35:20.907Z'
     */
    dateString: string;
    /**
     * @default 'small'
     */
    size?: 'small' | 'medium';
    className?: string;
}
