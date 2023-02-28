import { useState } from "react";
import { Spacing } from "../styles";

interface Option {
  label: string;
  value: string;
}

export const RadioPicker = <T extends string | null | undefined>({
  options,
  handleChange,
  defaultValue,
}: {
  options: Option[];
  handleChange: (s: T) => void;
  defaultValue: T;
}) => {
  const [selectedOption, setSelectedOption] = useState<T>(defaultValue);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = event.target.value as T;
    handleChange(newVal);
    setSelectedOption(newVal);
  };

  return (
    <div>
      {options.map((option) => (
        <label key={option.value} style={{ margin: Spacing.ONE }}>
          <input
            type="radio"
            value={option.value}
            checked={selectedOption === option.value}
            onChange={handleOptionChange}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};
