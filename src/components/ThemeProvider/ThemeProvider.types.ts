import { ReactElement } from 'react';

export interface IThemeColors {
    primary: string;
    primaryDark: string;
    secondary: string;
    secondaryDark: string;

    foregroundPrimary: string;
    foregroundPrimaryLight: string;
    foregroundSecondary: string;
    foregroundSecondaryLight: string;
    foregroundTertiary: string;
    foregroundTertiaryLight: string;

    backgroundPrimary: string;
    backgroundPrimaryDark: string;
    backgroundSecondary: string;
    backgroundTertiary: string;

    success: string;
    successDark: string;
    info: string;
    infoDark: string;
    warning: string;
    warningDark: string;
    danger: string;
    dangerDark: string;
    link: string;
    linkDark: string;

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
