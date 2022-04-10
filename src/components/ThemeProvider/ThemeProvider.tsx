import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react';
import '../../styles/core.scss';
import { IThemeColors, IThemeFontSizes, ITheme, IThemeProviderProps } from './ThemeProvider.types';
import { ThemeProviderService } from './ThemeProvider.service';

interface IThemeContext {
    theme: ITheme;
    setTheme: (theme: ITheme) => void;
}

export const ThemeContext = createContext<IThemeContext>({
    theme: ThemeProviderService.getDefaultTheme(),
    setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider(props: IThemeProviderProps): ReactElement {
    // props
    const { children, theme = ThemeProviderService.getDefaultTheme() } = props;

    // state
    const [currentTheme, setCurrentTheme] = useState<ITheme>(theme);

    // effects
    // on theme change
    useEffect(() => {
        setCurrentTheme(theme);
    }, [theme]);

    // writes theme colors / fontsizes to the css variables on theme change
    useEffect(() => {
        const { colors = {} as IThemeColors, fontSizes = {} as IThemeFontSizes } = currentTheme;

        Object.keys(colors).forEach((key) => {
            document.documentElement.style.setProperty(
                `--color-${key}`,
                colors[key as keyof IThemeColors],
            );
        });

        Object.keys(fontSizes).forEach((key) => {
            document.documentElement.style.setProperty(
                `--fontsize-${key}`,
                fontSizes[key as keyof IThemeFontSizes],
            );
        });
    }, [currentTheme]);

    // paint
    return (
        <ThemeContext.Provider value={{ theme: currentTheme, setTheme: setCurrentTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
