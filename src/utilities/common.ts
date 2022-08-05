import { SyntheticEvent } from 'react';

/**
 *
 * Simulate Network call delay while development
 * @param delay in seconds
 * @default 4000
 */
export const introduceDelay = async (delay = 4000): Promise<boolean> =>
    new Promise((resolve) =>
        setTimeout(() => {
            resolve(true);
        }, delay),
    );

// Generate a unique id
export const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

/**
 * Gives the text dimension of the passed in string
 * @param text the text to measure
 * @param fontSize in pixes
 * @param fontFamily the font family
 * @param fontWeight the font weight
 */
export const getTextDimension = (
    text: string,
    options?: Partial<{
        fontSize: string | number;
        fontFamily: string;
        fontWeight: string;
    }>,
): { width: number; height: number } => {
    const { fontSize, fontFamily, fontWeight } = {
        fontSize: 12,
        fontFamily: 'sans-serif',
        fontWeight: 'normal',
        ...(options || {}),
    };
    let [width, height] = [0, 0];
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
        const formattedFontSize = typeof fontSize === 'number' ? `${fontSize}px` : fontSize;
        context.font = `${fontWeight} ${formattedFontSize} ${fontFamily}`;
        const metrics = context.measureText(text);
        width = metrics.width;
        // let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        height = actualHeight;
    }
    return { width, height };
};

// A wrapper for "JSON.parse()"" to support "undefined" value
export const parseJSON = <T>(value: string | null): T | undefined => {
    try {
        return value === 'undefined' ? undefined : JSON.parse(value ?? '');
    } catch {
        console.error('parsing error on', { value });
        return undefined;
    }
};

// removes the broken image icon broken url
export const onImageLoadError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.style.display = 'none';
};

// gives key , if
export const formKey = (...keys: (string | number)[]) => {
    // if key is not provided, generate a random key
    if (!keys.length) {
        return uuidv4();
    }
    // if key available sanitize and return
    return keys.join('_');
};
