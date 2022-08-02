import { TSpinnerSize } from '../Spinner/Spinner.types';

export interface ICircularLoaderWithMessageProps {
    loadingState?: 'loading' | 'loaded' | 'error';
    message?: string;
    size?: TSpinnerSize;
    style?: React.CSSProperties;
}
