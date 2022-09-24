import { ReactNode } from 'react';
import { TSpinnerColor, TSpinnerSize } from '../Spinner/Spinner.types';

export interface ICircularLoaderWithMessageProps {
    loadingState?: 'loading' | 'loaded' | 'error';
    spinnerColor?: TSpinnerColor;
    message?: ReactNode;
    size?: TSpinnerSize;
    style?: React.CSSProperties;
    messageStyle?: React.CSSProperties;
    /**
     * @default 20 - in px
     */
    loaderTitleGap?: number;
    /**
     * @default 'horizontal'
     */
    direction: 'vertical' | 'horizontal';
}
