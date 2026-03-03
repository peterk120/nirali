import * as React from 'react';
import { cn } from '../../lib/utils';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'onChange'> {
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<
  HTMLInputElement,
  SliderProps
>(({ className, defaultValue = [], onValueChange, ...props }, ref) => {
  const [values, setValues] = React.useState(defaultValue);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    // For simplicity, handling single value slider
    setValues([newValue]);
    if (onValueChange) {
      onValueChange([newValue]);
    }
  };

  return (
    <input
      type="range"
      className={cn(
        "block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",
        className
      )}
      ref={ref}
      value={values[0]}
      onChange={handleChange}
      {...props}
    />
  );
});
Slider.displayName = "Slider";

export { Slider };