export type TSpinnerSize = 'small' | 'medium' | 'large';

export type TSpinnerColor = 'primary' | 'secondary';

export interface ISpinnerProps {
    /**
     * @default 'medium'
     */
    size?: TSpinnerSize;
    /**
     * @default 'primary'
     */
    color?: TSpinnerColor;
}
