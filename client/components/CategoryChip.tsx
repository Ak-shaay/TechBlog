import { cn } from "@/lib/utils";

interface CategoryChipProps {
  name: string;
  icon?: React.ReactNode;
  count?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CategoryChip({
  name,
  icon,
  count,
  isSelected = false,
  onClick,
}: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 cursor-pointer",
        isSelected
          ? "bg-primary text-primary-foreground shadow-md"
          : "bg-secondary text-foreground border border-border hover:border-primary hover:bg-card"
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{name}</span>
      {count !== undefined && (
        <span
          className={cn(
            "ml-1 text-xs font-semibold rounded-full px-2 py-1",
            isSelected
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-muted-foreground/10 text-muted-foreground"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
