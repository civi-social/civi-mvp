import { useState } from "react";
import type { StyleHack } from "../styles";
import { Skin } from "../styles";
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
    <div style={{ display: "flex", flexDirection: "row" }}>
      {options.map((option) => (
        <label
          key={option.value}
          style={{
            marginTop: Spacing.ONE,
            marginBottom: Spacing.ONE,
            marginLeft: Spacing.ZERO,
            marginRight: Spacing.ZERO,
            paddingTop: Spacing.TWO,
            paddingRight: Spacing.FOUR,
            paddingBottom: Spacing.TWO,
            paddingLeft: Spacing.FOUR,
            display: "inline-flex",
            color: Skin.White,
            fontWeight: 700,
            backgroundColor:
              selectedOption === option.value
                ? ("rgba(0,0,0,0.7)" as StyleHack)
                : undefined,
          }}
        >
          <input
            style={{ display: "none" }}
            type="radio"
            value={option.value}
            onChange={handleOptionChange}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};
