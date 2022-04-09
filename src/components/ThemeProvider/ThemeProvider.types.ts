import { ReactElement } from 'react';

export interface IThemeColors {
    primary: string;
    secondary: string;

    foregroundPrimary: string;
    foregroundSecondary: string;
    foregroundTertiary: string;
    foregroundPrimaryLight: string;

    backgroundPrimary: string;
    backgroundSecondary: string;
    backgroundTertiary: string;

    success: string;
    info: string;
    warning: string;
    danger: string;
    link: string;

    contentVideo: string;
    contentBlog: string;
    contentPodcast: string;
    contentMusic: string;
    contentPhoto: string;
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
