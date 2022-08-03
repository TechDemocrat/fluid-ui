import { IInputProps, IValidationResult } from './Input.types';

export class InputService {
    // in built validator
    static validate = (value: string | number, type: IInputProps['type']): IValidationResult => {
        let isValid = true;
        let message = '';
        if (value === '') {
            return {
                type: 'idle',
                message: '',
            };
        }

        switch (type) {
            case 'text':
                isValid = (value as string)?.length > 0;
                message = isValid ? '' : 'Please enter a value';
                break;
            case 'number':
                isValid = !isNaN(Number(value));
                message = isValid ? '' : 'Please enter a valid number';
                break;

            case 'email':
                isValid =
                    (value as string)?.length > 0 &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string);
                message = isValid ? '' : 'Please enter a valid email';
                break;
            case 'password':
                isValid = (value as string)?.length > 0;
                message = isValid ? '' : 'Please enter a value';
                break;
            default:
                isValid = true;
                message = '';
                break;
        }

        return { type: isValid ? 'success' : 'error', message };
    };
}
