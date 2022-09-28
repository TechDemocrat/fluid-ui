import React, { CSSProperties, RefObject, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { IInputProps, IValidationResult, TInputValue } from './Input.types';
import styles from './Input.module.scss';
import { InputService } from './Input.service';
import { Icon } from '@iconify/react';
import { check, close, error } from '../../assets/icons/iconify';
import { useTheme } from '../ThemeProvider/ThemeProvider';
import { formKey } from '../../utilities';
import { useEventListener } from '../../hooks';
import { isEqual } from 'lodash';

export const Input = (props: IInputProps) => {
    // props
    const {
        type = 'text',
        size = 'medium',
        width,
        height,
        label = '',
        placeholder = '',
        value = '',
        disabled = false,
        autoFocus = false,
        showIcon = false,
        showMessage = false,
        resize = 'none',
        tags: originalTags = [],
        onChange,
        onTagsChange,
        validate,
    } = props;

    // refs
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    //state
    const [localValue, setLocalValue] = useState<TInputValue>(value);
    const [tags, setTags] = useState<string[]>(originalTags);
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
    const onWrapperClick = () => {
        inputRef.current?.focus();
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const onTagDelete = (index: number) => () => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
        onTagsChange?.(newTags);
    };

    const handleKeyboardEventForTags = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            // this restricts submitting the form on enter if used inside a form
            e.preventDefault();
            e.stopPropagation();

            const newTags = [...tags, localValue as string];
            setTags(newTags);
            onTagsChange?.(newTags);
            setLocalValue('');
        }
    };

    // effects
    useEffect(() => {
        if (localValue !== value) {
            setLocalValue(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    useEffect(() => {
        if (!isEqual(originalTags, tags)) {
            setTags([...originalTags]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originalTags]);

    // event listeners
    useEventListener('keyup', handleKeyboardEventForTags, inputFieldFocus && type === 'tags');

    // compute
    const hasValue = localValue.toString().length > 0;
    const hasPlaceholder = placeholder && placeholder.length > 0;
    const hasLabel = label && label.length > 0;
    const hasIcon = showIcon && validationType !== 'idle';
    const hasMessage = showMessage && validationType !== 'idle' && validationMessage;
    const validationColor = validationType === 'success' ? colors.success : colors.danger;
    const hasTags = type === 'tags' && tags.length > 0;
    const levitateLabel = hasValue || hasPlaceholder || inputFieldFocus || hasTags;

    const wrapperStyle: CSSProperties = {
        width,
        height,
    };

    const textareaStyle: CSSProperties = {
        resize,
    };

    // paint
    return (
        <div
            className={cn(styles.wrapper, styles[size], {
                [styles.labelHeightBuffer]: hasLabel,
                [styles.messageHeightBuffer]: showMessage,
                [styles.textareaSize]: type === 'textarea',
                [styles.tags]: hasTags,
            })}
            style={wrapperStyle}
            onClick={onWrapperClick}
        >
            {type !== 'textarea' ? (
                <div className={styles.tagsWrapper}>
                    {hasTags && (
                        <div className={styles.tagsContainer}>
                            {tags.map((tag, index) => {
                                return (
                                    <div key={formKey(tag, index)} className={styles.tagNode}>
                                        <div className={styles.tag}>{tag}</div>
                                        <div
                                            className={styles.tagDeleteIcon}
                                            role="button"
                                            onClick={onTagDelete(index)}
                                        >
                                            <Icon icon={close} inline />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <input
                        className={cn(styles.input, { [styles.disabled]: disabled })}
                        ref={inputRef as RefObject<HTMLInputElement>}
                        disabled={disabled}
                        type={type}
                        placeholder={placeholder}
                        value={localValue}
                        autoFocus={autoFocus}
                        onChange={handleTextChange}
                        onFocus={handleOnFocus}
                        onBlur={handleOnBlur}
                    />
                </div>
            ) : (
                <textarea
                    className={cn(styles.input, styles.textarea, styles[size], {
                        [styles.disabled]: disabled,
                    })}
                    ref={inputRef as RefObject<HTMLTextAreaElement>}
                    style={textareaStyle}
                    disabled={disabled}
                    placeholder={placeholder}
                    value={localValue}
                    autoFocus={autoFocus}
                    onChange={handleTextChange}
                    onFocus={handleOnFocus}
                    onBlur={handleOnBlur}
                />
            )}
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
