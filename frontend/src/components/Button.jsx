import React from 'react';
import { cn } from '../utils/classNames';

const variantStyles = {
  primary: 'bg-primary text-[#F7F1DE] hover:-translate-y-0.5 hover:shadow-soft',
  secondary: 'bg-white text-primary border border-border hover:bg-[#f5edd4]',
  ghost: 'bg-transparent text-primary hover:bg-white/70',
  danger: 'bg-danger text-white hover:-translate-y-0.5 hover:shadow-soft',
  soft: 'bg-surface text-primary hover:brightness-95',
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-sm',
};

const Button = React.forwardRef(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', as: Component = 'button', children, ...props },
  ref,
) {
  const componentProps = {
    ref,
    className: cn(
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 ease-out disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
      variantStyles[variant],
      sizeStyles[size],
      className,
    ),
    ...props,
  };

  if (Component === 'button') {
    componentProps.type = type;
  }

  return <Component {...componentProps}>{children}</Component>;
});

export default Button;