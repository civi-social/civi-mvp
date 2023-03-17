import { useState } from "react";
import { classNames, StyleHack } from "../styles";
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

  const handleOptionChange = (newVal: T) => {
    handleChange(newVal);
    setSelectedOption(newVal);
  };

  return (
    <div className="flex flex-row justify-center">
      {options.map((option, i) => (
        <div
          key={option.value}
          role="radio"
          aria-checked={defaultValue === option.value}
          onClick={() => handleOptionChange(option.value as T)}
          className={classNames(
            i === 0 && "border-l-2",
            "border-t-2 border-b-2 border-r-2 border-black border-opacity-50",
            "my-1 mx-0 inline-flex cursor-pointer py-3 px-4 font-bold text-white",
            i === 0
              ? "rounded-l-lg"
              : i === options.length - 1
              ? "rounded-r-lg"
              : "",
            `bg-opacity-70 ${selectedOption === option.value ? "bg-black" : ""}`
          )}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};
