import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { IDescriptionProps } from './Description.types';
import styles from './Description.module.scss';
import { debounce } from 'lodash';
import { Link } from '../Link/Link';

export const Description: React.FC<IDescriptionProps> = (props) => {
    // props
    const { children } = props;
    // state
    const [clamped, setClamped] = useState(true);
    const [showButton, setShowButton] = useState(true);
    // refs
    const containerRef = useRef<HTMLDivElement>(null);
    // effects
    useEffect(() => {
        const hasClamping = (element: HTMLDivElement) => {
            const { clientHeight, scrollHeight } = element;
            return clientHeight !== scrollHeight;
        };

        const checkButtonAvailability = () => {
            if (containerRef.current) {
                const hadClampClass = containerRef.current.classList.contains('clamp');
                if (!hadClampClass) containerRef.current.classList.add('clamp');
                setShowButton(hasClamping(containerRef.current));
                if (!hadClampClass) containerRef.current.classList.remove('clamp');
            }
        };

        const debouncedCheck = debounce(checkButtonAvailability, 50);
        checkButtonAvailability();
        window.addEventListener('resize', debouncedCheck);
        return () => {
            window.removeEventListener('resize', debouncedCheck);
        };
    }, [containerRef]);

    const handleClick = () => setClamped(!clamped);

    return (
        <div className={styles.wrapper}>
            <div ref={containerRef} className={cn(styles.longText, clamped && styles.clamp)}>
                {children}
            </div>
            {showButton && (
                <div className={styles.linkWrapper}>
                    <Link onClick={handleClick}>Read {clamped ? 'more' : 'less'}</Link>
                </div>
            )}
        </div>
    );
};
