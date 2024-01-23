type FilterItemProps = {
  label: string;
  isChecked: boolean;
  onToggle: (value?: string) => void;
  toggleValue?: string;
};

export function FilterItem({
  label,
  isChecked,
  onToggle,
  toggleValue,
}: FilterItemProps) {
  return (
    <label className="cursor-pointer text-sm hover:text-blue-300">
      <input
        type="checkbox"
        className="mr-1 cursor-pointer"
        checked={isChecked}
        onChange={() => onToggle(toggleValue)}
      />
      {label}
    </label>
  );
}
