import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RangeSelectProps {
  min: number;
  max: number;
  step?: number; // Can be negative for descending lists (e.g. -10 for 120 -> 60)
  value: number;
  onChange: (value: number) => void;
  formatLabel?: (val: number) => string; // Custom way to format the numbers
}

export function RangeSelect({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatLabel = (val) => val.toString(), // Default just shows the number
}: RangeSelectProps) {
  
  // Generate the numbers array based on min, max, and step
  const options: number[] = [];
  
  if (step > 0) {
    for (let i = min; i <= max; i += step) options.push(i);
  } else if (step < 0) {
    // For descending ranges (e.g., min: 120, max: 60, step: -10)
    for (let i = min; i >= max; i += step) options.push(i);
  }

  return (
    <Select
      value={value.toString()}
      onValueChange={(val) => onChange(Number(val))}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((num) => (
          <SelectItem key={num} value={num.toString()}>
            {formatLabel(num)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}