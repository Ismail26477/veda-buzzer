import { cn } from "@/lib/utils";

interface DepartmentFilterProps {
  departments: string[];
  selected: string | null;
  onChange: (department: string | null) => void;
}

export function DepartmentFilter({ departments, selected, onChange }: DepartmentFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onChange(null)}
        className={cn(
          "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200",
          selected === null
            ? "bg-primary text-primary-foreground shadow-glow-primary"
            : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
      >
        All
      </button>
      {departments.map((dept) => (
        <button
          key={dept}
          onClick={() => onChange(dept)}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200",
            selected === dept
              ? "bg-primary text-primary-foreground shadow-glow-primary"
              : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          {dept}
        </button>
      ))}
    </div>
  );
}
