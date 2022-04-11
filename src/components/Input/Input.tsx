import React from 'react';
import cn from 'classnames';

import { EInputSize, EInputType, IInputProps } from './Input.types';
import styles from './Input.module.scss';
import { InputService } from './Input.service';
import { Icon } from '@iconify/react';
import { check, error } from '../../utilities/icons/iconify';
import { useTheme } from '../ThemeProvider/ThemeProvider';

export const Input = (props: IInputProps) => {
    // props
    const {
        placeholder,
        value,
        type = EInputType.TEXT,
        size = EInputSize.MEDIUM,
        disabled,
        onChange,
    } = props;

    //state
    const [localValue, setLocalValue] = React.useState<string | number>(value);
    const [showIcon, setShowIcon] = React.useState(false);
    const [iconType, setIconType] = React.useState('check');
    const [errorMessage, setErrorMessage] = React.useState('');

    // theme
    const {
        theme: { colors },
    } = useTheme();

    // handler
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        const { isValid, errorMessage: message } = InputService.validate(text, type);
        setLocalValue(text);
        if (isValid) {
            if (type === EInputType.EMAIL && text.length > 0) {
                setShowIcon(true);
                setIconType('check');
                setErrorMessage('');
            }
        } else {
            if (type === EInputType.EMAIL) {
                setShowIcon(true);
                setIconType('error');
            }
            setErrorMessage(message);
        }
        onChange(text);
    };

    // paint
    return (
        <>
            <div className={cn(styles.wrapper, styles[`${size}`])} title={placeholder}>
                <input
                    className={cn(styles.input, { [styles.disabled]: disabled })}
                    // disabled={disabled}
                    type={type ?? 'text'}
                    placeholder={placeholder}
                    value={localValue}
                    onChange={(e) => handleTextChange(e)}
                />
                <span className={styles.placeholder}>{placeholder ?? 'Label'}</span>
                {showIcon && (
                    <span className={styles.icon}>
                        <Icon
                            icon={iconType === 'error' ? error : check}
                            color={iconType === 'error' ? colors.danger : colors.success}
                            className={cn(styles.icon)}
                        />
                    </span>
                )}
            </div>
            {errorMessage && <span className={styles.error}>{errorMessage}</span>}
        </>
    );
};
