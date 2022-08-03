export type TInputType = 'text' | 'number' | 'email' | 'password';
export type TInputSize = 'small' | 'medium' | 'large';

export type TInputValue = string | number;

export interface IInputProps {
    /**
     * value of the input
     * @default ''
     * @example
     * <Input value={'value'} />
     */
    value: TInputValue;
    /**
     * additional className for the input
     */
    className?: string;
    /**
     * label to be displayed
     */
    label?: string;
    /**
     * if placeholder passed the label will be in active state
     */
    placeholder?: string;
    /**
     * type of the input
     * @default 'text'
     * @example
     * <Input type="text" />
     * <Input type="number" />
     * <Input type="email" />
     * <Input type="password" />
     */
    type?: TInputType;
    /**
     * size of the input
     * @default 'medium'
     * @example
     * <Input size="small" />
     * <Input size="medium" />
     * <Input size="large" />
     */
    size?: TInputSize;

    /**
     * @default false
     * note; if true passed the width will be taken from parent container
     */
    inheritWidth?: boolean;
    /**
     * disabled input
     * @default false
     * @example
     * <Input disabled />
     * <Input disabled={true} />
     */
    disabled?: boolean;
    /**
     * auto focus on the input
     * @default false
     */
    autoFocus?: boolean;
    /**
     * show success / error icon
     * @default true
     */
    showIcon?: boolean;
    /**
     * show success / error icon
     * @default false
     *
     * note: bottom margin will be added if true passed (to avoid layout shift)
     */
    showMessage?: boolean;
    /**
     * value will be in number format if type is number
     * otherwise it will be in string format
     */
    onChange?: (value: TInputValue) => void;
    /**
     * if passed, will be used instead native validation handler
     */
    validate?: (value: TInputValue, type?: TInputType) => IValidationResult;
}

export type TResultMessageType = 'success' | 'error' | 'idle';

export interface IValidationResult {
    type: TResultMessageType;
    message: string;
}
