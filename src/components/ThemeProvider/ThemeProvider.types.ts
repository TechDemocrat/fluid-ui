import { ReactElement } from 'react';

export interface IThemeColors {
    primary: string;
    primaryLight: string;
    secondary: string;
    secondaryLight: string;

    foregroundPrimary: string;
    foregroundSecondary: string;
    foregroundTertiary: string;

    backgroundPrimary: string;
    backgroundSecondary: string;
    backgroundTertiary: string;

    success: string;
    successLight: string;
    info: string;
    infoLight: string;
    warning: string;
    warningLight: string;
    danger: string;
    dangerLight: string;
    link: string;
    linkLight: string;

    brandColor1: string;
    brandColor2: string;
    brandColor3: string;
    brandColor4: string;
    brandColor5: string;
    brandColor6: string;
}

export interface IThemeFontSizes {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
    bodyIntro: string;
    bodyMain: string;
    medium: string;
    caption: string;
    small: string;
}

export interface ITheme {
    colors: IThemeColors;
    fontSizes: IThemeFontSizes;
}

export interface IThemeProviderProps {
    theme?: ITheme;
    children?: ReactElement | ReactElement[] | string | number;
}
