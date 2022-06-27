import '../../styles/core.scss';
import React, { createContext, ReactElement, useContext, useEffect, useRef, useState } from 'react';
import { IThemeColors, IThemeFontSizes, ITheme, IThemeProviderProps } from './ThemeProvider.types';
import { ThemeProviderService } from './ThemeProvider.service';
import { isEqual } from 'lodash';

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

    // refs
    const previousTheme = useRef<ITheme | null>(null); // | null to mutate the ref directly

    // state
    const [currentTheme, setCurrentTheme] = useState<ITheme>(theme);

    // effects
    // on theme change
    useEffect(() => {
        if (!isEqual(theme, previousTheme.current)) {
            previousTheme.current = theme;
            setCurrentTheme(theme);
        }
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
