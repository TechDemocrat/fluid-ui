import { ITheme, IThemeColors, IThemeFontSizes } from './ThemeProvider.types';

export class ThemeProviderService {
    private static defaultColors: IThemeColors = {
        primary: '#0F307F',
        primaryDark: '#0f307f1a',
        secondary: '#9DADD0',
        secondaryDark: '#9dadd07c',

        foregroundPrimary: '#212121',
        foregroundPrimaryLight: '#FFFFFF',
        foregroundSecondary: '#666666',
        foregroundSecondaryLight: '#F5F5F5',
        foregroundTertiary: '#9E9E9E',
        foregroundTertiaryLight: '#E0E0E0',

        backgroundPrimary: '#FFFFFF',
        backgroundPrimaryDark: '#212121',
        backgroundSecondary: '#F5F5F5',
        backgroundTertiary: '#E0E0E0',

        success: '#00C851',
        successDark: '#007E33',
        info: '#33b5e5',
        infoDark: '#0099CC',
        warning: '#ffbb33',
        warningDark: '#FF8800',
        danger: '#CC0000',
        dangerDark: '#ff4444',
        link: '#3B6FEE',
        linkDark: '#3b6eee7a',

        contentVideo: '#0086CE',
        contentBlog: '#FFB857',
        contentPodcast: '#8E7CC3',
        contentMusic: '#5EBC6E',
        contentPhoto: '#FA453C',
    };

    private static defaultFontSizes: IThemeFontSizes = {
        h1: '3rem',
        h2: '2.5rem',
        h3: '2rem',
        h4: '1.75rem',
        h5: '1.5rem',
        h6: '1.25rem',
        bodyIntro: '1.125rem',
        bodyMain: '1rem',
        medium: '0.875rem',
        caption: '0.75rem',
        small: '0.625rem',
    };

    public static getDefaultTheme = (): ITheme => ({
        colors: ThemeProviderService.defaultColors,
        fontSizes: ThemeProviderService.defaultFontSizes,
    });
}
