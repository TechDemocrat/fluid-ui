import React from 'react';
import { ThemeProvider } from '../src/components/ThemeProvider/ThemeProvider';
import '../src/styles/core.scss';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [(Story) => <ThemeProvider>{Story()}</ThemeProvider>];
