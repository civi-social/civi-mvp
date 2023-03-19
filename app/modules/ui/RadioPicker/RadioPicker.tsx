import { useState } from "react";
import { classNames } from "../styles";

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
    <div className="flex flex-row justify-center lg:justify-end">
      {options.map((option, i) => (
        <div
          key={option.value}
          role="radio"
          aria-checked={defaultValue === option.value}
          onClick={() => handleOptionChange(option.value as T)}
          className={classNames(
            "my-1 mx-0 inline-flex cursor-pointer py-2 px-3 text-white",
            i === 0 && "border-l-2",
            "border-t-2 border-b-2 border-r-2 border-black border-opacity-50",
            i === 0
              ? "rounded-l-lg"
              : i === options.length - 1
              ? "rounded-r-lg"
              : "",
            `${
              selectedOption === option.value
                ? "bg-black bg-opacity-70"
                : "bg-black bg-opacity-20"
            }`
          )}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};
