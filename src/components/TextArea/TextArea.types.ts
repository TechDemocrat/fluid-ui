import { IInputProps } from '../Input/Input.types';

export interface ITextAreaProps {
    /**
     * additional className for the input
     */
    className?: string;
    /**
     * placeholder text for the input by default it is Label
     */
    placeholder: string;
    /**
     * size of the input
     * @default "medium"
     * @example
     * <TextArea size="small" />
     * <TextArea size="medium" />
     * <TextArea size="large" />
     */
    size?: IInputProps['size'] | 'auto';
    /**
     * disabled input
     * @default false
     * @example
     * <TextArea disabled />
     * <TextArea disabled={true} />
     */
    disabled?: boolean;
    /**
     * value of the input
     * @default ''
     * @example
     * <TextArea value={'value'} />
     */
    value: string | number;
    /**
     * onChange event handler
     * @example
     * <TextArea onChange={(e) => {}} />
     */
    onChange: (value: string | number) => void;
}
