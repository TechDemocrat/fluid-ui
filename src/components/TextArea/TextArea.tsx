import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { ITextAreaProps } from './TextArea.types';
import styles from './TextArea.module.scss';

export const TextArea = (props: ITextAreaProps) => {
    // props
    const {
        className,
        placeholder,
        size = 'small',
        disabled = false,
        value: propValue,
        onChange,
    } = props;

    // state
    const [value, setValue] = useState(propValue);

    // effect
    useEffect(() => {
        setValue(propValue);
    }, [propValue]);

    // handler
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        onChange(e.target.value);
    };

    // paint
    return (
        <div className={cn(styles.textAreaWrapper, className, styles[size])}>
            <textarea
                className={cn(styles.textarea, { [styles.disabled]: disabled })}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
        </div>
    );
};
