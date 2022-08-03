import React, { useState } from 'react';
import cn from 'classnames';

import { IInputProps, IValidationResult } from './Input.types';
import styles from './Input.module.scss';
import { InputService } from './Input.service';
import { Icon } from '@iconify/react';
import { check, error } from '../../assets/icons/iconify';
import { useTheme } from '../ThemeProvider/ThemeProvider';

export const Input = (props: IInputProps) => {
    // props
    const {
        type = 'text',
        size = 'medium',
        inheritWidth = false,
        label = '',
        placeholder = '',
        value = '',
        disabled = false,
        autoFocus = false,
        showIcon = true,
        showMessage = false,
        onChange,
        validate,
    } = props;

    //state
    const [localValue, setLocalValue] = useState<string | number>(value);
    const [inputFieldFocus, setInputFieldFocus] = useState<boolean>(autoFocus);
    const [{ message: validationMessage, type: validationType }, setValidationResult] =
        useState<IValidationResult>({
            type: 'idle',
            message: '',
        });

    // theme
    const {
        theme: { colors },
    } = useTheme();

    // handler
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setLocalValue(inputValue);

        const { type: resultType, message: resultMessage } =
            validate?.(inputValue, type) ?? InputService.validate(inputValue, type);
        setValidationResult({
            type: resultType,
            message: resultMessage,
        });

        onChange?.(inputValue);
    };

    const handleOnFocus = () => {
        setInputFieldFocus(true);
    };

    const handleOnBlur = () => {
        setInputFieldFocus(false);
    };

    // compute
    const hasValue = localValue.toString().length > 0;
    const hasPlaceholder = placeholder && placeholder.length > 0;
    const hasIcon = showIcon && validationType !== 'idle';
    const hasMessage = showMessage && validationType !== 'idle' && validationMessage;
    const validationColor = validationType === 'success' ? colors.success : colors.danger;
    const levitateLabel = hasValue || hasPlaceholder || inputFieldFocus;

    // paint
    return (
        <div
            className={cn(styles.wrapper, styles[`${size}`], {
                [styles.messageHeightBuffer]: showMessage,
                [styles.small]: size === 'small',
                [styles.medium]: size === 'medium',
                [styles.large]: size === 'large',
            })}
            style={{
                width: inheritWidth ? '100%' : undefined,
            }}
        >
            <input
                className={cn(styles.input, { [styles.disabled]: disabled })}
                disabled={disabled}
                type={type}
                placeholder={placeholder}
                value={localValue}
                autoFocus={autoFocus}
                onChange={handleTextChange}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
            />
            <div
                className={cn(styles.label, {
                    [styles.levitateLabel]: levitateLabel,
                })}
            >
                {label}
            </div>
            {hasIcon && (
                <div className={styles.icon}>
                    <Icon
                        icon={validationType === 'error' ? error : check}
                        color={validationColor}
                        className={cn(styles.icon)}
                    />
                </div>
            )}
            {hasMessage && (
                <div
                    className={cn(styles.message)}
                    style={{
                        color: validationColor,
                    }}
                >
                    {validationMessage}
                </div>
            )}
        </div>
    );
};
