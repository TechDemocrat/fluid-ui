export type TSpinnerSize = 'small' | 'medium' | 'large';

export type TSpinnerColor = 'primary' | 'secondary' | 'tertiary';

export interface ISpinnerProps {
    /**
     * @default 'medium'
     */
    size?: TSpinnerSize;
    /**
     * @default 'primary'
     */
    color?: TSpinnerColor;
    className?: string;
}
