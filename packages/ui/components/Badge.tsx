import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@nirali-sai/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-default',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80 active:bg-primary/70 focus:ring',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 focus:ring',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 active:bg-destructive/70 focus:ring',
        outline: 'text-foreground border border-input hover:bg-accent active:bg-accent/70 focus:ring',
        // Brand-specific variants for each app
        'boutique-rose': 'border-transparent bg-brand-rose text-white hover:bg-brand-rose/90 active:bg-brand-rose/80 focus:ring',
        'boutique-gold': 'border-transparent bg-brand-gold text-white hover:bg-brand-gold/90 active:bg-brand-gold/80 focus:ring',
        'boutique-ivory': 'border-transparent bg-brand-ivory text-gray-900 hover:bg-brand-ivory/90 active:bg-brand-ivory/80 focus:ring',
        'bridal-gold': 'border-transparent bg-brand-gold text-white hover:bg-brand-gold/90 active:bg-brand-gold/80 focus:ring',
        'bridal-maroon': 'border-transparent bg-brand-maroon text-white hover:bg-brand-maroon/90 active:bg-brand-maroon/80 focus:ring',
        'bridal-cream': 'border-transparent bg-brand-cream text-gray-900 hover:bg-brand-cream/90 active:bg-brand-cream/80 focus:ring',
        'sasthik-teal': 'border-transparent bg-brand-teal text-white hover:bg-brand-teal/90 active:bg-brand-teal/80 focus:ring',
        'sasthik-rose-gold': 'border-transparent bg-brand-rose-gold text-white hover:bg-brand-rose-gold/90 active:bg-brand-rose-gold/80 focus:ring',
        'tamil-plum': 'border-transparent bg-brand-plum text-white hover:bg-brand-plum/90 active:bg-brand-plum/80 focus:ring',
        'tamil-blush': 'border-transparent bg-brand-blush text-gray-900 hover:bg-brand-blush/90 active:bg-brand-blush/80 focus:ring',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type BadgeVariant = 
  | 'default'
  | 'secondary' 
  | 'destructive'
  | 'outline'
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

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };