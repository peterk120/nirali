import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@nirali-sai/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 focus:ring',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 focus:ring',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/70 focus:ring',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 focus:ring',
        ghost: 'hover:bg-accent hover:text-accent-foreground active:bg-accent/70 focus:ring',
        link: 'text-primary underline-offset-4 hover:underline active:underline focus:ring',
        // Brand-specific variants for each app
        'boutique-rose': 'bg-brand-rose text-white hover:bg-brand-rose/90 active:bg-brand-rose/80 focus:ring',
        'boutique-gold': 'bg-brand-gold text-white hover:bg-brand-gold/90 active:bg-brand-gold/80 focus:ring',
        'boutique-ivory': 'bg-brand-ivory text-gray-900 hover:bg-brand-ivory/90 active:bg-brand-ivory/80 focus:ring',
        'bridal-gold': 'bg-brand-gold text-white hover:bg-brand-gold/90 active:bg-brand-gold/80 focus:ring',
        'bridal-maroon': 'bg-brand-maroon text-white hover:bg-brand-maroon/90 active:bg-brand-maroon/80 focus:ring',
        'bridal-cream': 'bg-brand-cream text-gray-900 hover:bg-brand-cream/90 active:bg-brand-cream/80 focus:ring',
        'sasthik-teal': 'bg-brand-teal text-white hover:bg-brand-teal/90 active:bg-brand-teal/80 focus:ring',
        'sasthik-rose-gold': 'bg-brand-rose-gold text-white hover:bg-brand-rose-gold/90 active:bg-brand-rose-gold/80 focus:ring',
        'tamil-plum': 'bg-brand-plum text-white hover:bg-brand-plum/90 active:bg-brand-plum/80 focus:ring',
        'tamil-blush': 'bg-brand-blush text-gray-900 hover:bg-brand-blush/90 active:bg-brand-blush/80 focus:ring',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export type ButtonVariant = 
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'boutique-rose'
  | 'boutique-gold'
  | 'boutique-ivory'
  | 'bridal-gold'
  | 'bridal-maroon'
  | 'bridal-cream'
  | 'sasthik-teal'
  | 'sasthik-rose-gold'
  | 'tamil-plum'
  | 'tamil-blush';

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };