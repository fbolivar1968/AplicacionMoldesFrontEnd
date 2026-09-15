import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Toggles whether the button takes full width on small screens and auto width on sm+ screens.
     */
    fullWidthMobile?: boolean;
    /**
     * Visual style variant of the button.
     */
    variant?: ButtonVariant;
    /**
     * Size configuration adjusting padding and typography responsive touch targets.
     */
    size?: ButtonSize;
    /**
     * Optional icon to show before label.
     */
    leftIcon?: React.ReactNode;
    /**
     * Optional icon to show after label.
     */
    rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blueFB hover:bg-blueFB/90 text-white shadow-sm border border-transparent',
    secondary: 'bg-orangeFB hover:bg-orangeFB/90 text-white shadow-sm border border-transparent',
    outline: 'border border-blueFB text-blueFB hover:bg-blueFB hover:text-white bg-transparent',
    ghost: 'bg-transparent hover:bg-blueFB/10 text-blueFB border border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
    // Touch target starts safely at px-4 py-2.5 on mobile and scales smoothly
    sm: 'px-3 py-2 text-xs sm:text-sm min-h-[40px] sm:min-h-[36px]',
    md: 'px-4 py-2.5 sm:px-5 sm:py-2.5 text-sm sm:text-base min-h-[44px] sm:min-h-[40px]',
    lg: 'px-5 py-3 sm:px-6 sm:py-3.5 text-base sm:text-lg min-h-[48px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            fullWidthMobile = false,
            variant = 'primary',
            size = 'md',
            leftIcon,
            rightIcon,
            className = '',
            disabled,
            type = 'button',
            ...props
        },
        ref
    ) => {
        const widthStyles = fullWidthMobile ? 'w-full sm:w-auto' : 'w-auto';

        const baseStyles =
            'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blueFB/40 disabled:opacity-50 disabled:cursor-not-allowed select-none';

        return (
            <button
                ref={ref}
                type={type}
                disabled={disabled}
                className={`${baseStyles} ${widthStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`.trim()}
                {...props}
            >
                {leftIcon && <span className="inline-flex mr-2 items-center">{leftIcon}</span>}
                {children}
                {rightIcon && <span className="inline-flex ml-2 items-center">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
