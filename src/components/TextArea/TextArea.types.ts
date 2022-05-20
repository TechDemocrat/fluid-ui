import { EInputSize } from '../Input/Input.types';

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
     * @default EInputSize.MEDIUM
     * @see EInputSize
     * @example
     * <TextArea size={EInputSize.SMALL} />
     * <TextArea size={EInputSize.MEDIUM} />
     * <TextArea size={EInputSize.LARGE} />
     */
    size?: EInputSize;
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
