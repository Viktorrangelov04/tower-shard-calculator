import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";

interface LevelPickerProps {
  label: string;
  levels: number[];      
  currentLevel: number;
  onChange: (level: number) => void;
  unit?: string;
  prefix?: string;
  min?: number; // Kept as number
}

export default function CardLevelPicker({ 
  label, 
  levels, 
  currentLevel, 
  onChange, 
  unit = "%", 
  prefix = "+", 
  min = 0 
}: LevelPickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-semibold">{label}</Label>
        <span className="text-sm font-bold text-primary">
          {prefix}{levels[currentLevel] ?? 0}{unit}
        </span>
      </div>

      <ToggleGroup
        type="single"
        value={(currentLevel ?? min).toString()} 
        onValueChange={(val) => val && onChange(parseInt(val))}
        className="flex flex-wrap gap-1 justify-start"
      >
        {levels.map((_, index) => {
          if (index < min) return null;

          const lvl = index;
          return (
            <ToggleGroupItem
              key={lvl}
              value={lvl.toString()}
              className="w-9 h-9 border rounded-md data-[state=on]:bg-green-300"
            >
              {lvl}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}