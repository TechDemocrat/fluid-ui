import { CSSProperties } from 'react';

export type TInputType = 'text' | 'number' | 'email' | 'password' | 'textarea' | 'tags';
export type TInputSize = 'small' | 'medium' | 'large';

export type TInputValue = string | number;

export interface IInputProps {
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
     * value of the input
     * @default ''
     * @example
     * <Input value={'value'} />
     */
    value?: TInputValue;
    /**
     * should be passed when type is 'tags'
     * @default []
     * @example
     * <Input tags={[]} />
     */
    tags?: string[];
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
     * size of the input
     * @default 'medium'
     * @example
     * <Input size="small" />
     * <Input size="medium" />
     * <Input size="large" />
     */
    size?: TInputSize;

    /**
     * @default 'width will be based on the size prop'
     * note; if true passed the width will be taken from parent container
     */
    width?: CSSProperties['width'];
    /**
     * @default 'width will be based on the size prop'
     * note; if true passed the width will be taken from parent container
     */
    height?: CSSProperties['height'];
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
     * @default false
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
     * resize applicable only if type is 'textarea'
     */
    resize?: CSSProperties['resize'];
    /**
     * value will be in number format if type is number
     * otherwise it will be in string format
     */
    onChange?: (value: TInputValue) => void;
    /**
     * value will be in number format if type is number
     * otherwise it will be in string format
     */
    onTagsChange?: (value: string[]) => void;
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
