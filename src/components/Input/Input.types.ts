export enum EInputSize {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
}

export enum EInputType {
    TEXT = 'text',
    NUMBER = 'number',
    EMAIL = 'email',
    PASSWORD = 'password',
}

export interface IInputProps {
    /**
     * additional className for the input
     */
    className?: string;
    /**
     * placeholder text for the input by default it is Label
     */
    placeholder: string;
    /**
     * type of the input
     * @default EInputType.TEXT
     * @see EInputType
     * @example
     * <Input type={EInputType.NUMBER} />
     * <Input type={EInputType.EMAIL} />
     * <Input type={EInputType.PASSWORD} />
     * <Input type={EInputType.TEXT} />
     */
    type: EInputType;
    /**
     * size of the input
     * @default EInputSize.MEDIUM
     * @see EInputSize
     * @example
     * <Input size={EInputSize.SMALL} />
     * <Input size={EInputSize.MEDIUM} />
     * <Input size={EInputSize.LARGE} />
     */
    size?: EInputSize;
    /**
     * disabled input
     * @default false
     * @example
     * <Input disabled />
     * <Input disabled={true} />
     */
    disabled?: boolean;
    /**
     * value of the input
     * @default ''
     * @example
     * <Input value={'value'} />
     */
    value: string | number;
    /**
     * onChange event handler
     * @example
     * <Input onChange={(e) => {}} />
     */
    onChange: (value: string | number) => void;
}
