import { EInputType } from './Input.types';

export class InputService {
    // actions goes here
    static getTitle = (title: string) => title;

    static validate = (value: string | number, type: EInputType) => {
        let isValid = true;
        let errorMessage = '';
        if (value === '') {
            return {
                isValid: true,
                errorMessage: '',
            };
        }
        switch (type) {
            case EInputType.TEXT:
                isValid = (value as string)?.length > 0;
                errorMessage = 'Please enter a value';
                return { isValid, errorMessage };
            case EInputType.NUMBER:
                isValid = !isNaN(Number(value));
                errorMessage = 'Please enter a valid number';
                return { isValid, errorMessage };

            case EInputType.EMAIL:
                isValid =
                    (value as string)?.length > 0 &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string);
                errorMessage = 'Please enter a valid email';
                return { isValid, errorMessage };
            case EInputType.PASSWORD:
                isValid = (value as string)?.length > 0;
                errorMessage = 'Please enter a value';
                return { isValid, errorMessage };
            default:
                isValid = true;
                errorMessage = '';
                return { isValid, errorMessage };
        }
    };
}
