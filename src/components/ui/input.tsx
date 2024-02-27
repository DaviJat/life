import * as React from 'react';

import { cn } from '@/lib/utils';
import { NumberFormatBase } from 'react-number-format';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  currency?: boolean;
}

function currencyFormatter(value: string) {
  const number = Number(value);
  const amount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(number / 100);

  return `${amount}`;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, currency, ...props }, ref) => {
  if (currency) {
    return (
      <NumberFormatBase
        format={(value) => (value !== '' ? currencyFormatter(value) : '')}
        prefix={'R$ '}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        placeholder={props.placeholder}
      />
    );
  } else {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
});
Input.displayName = 'Input';

export { Input };
