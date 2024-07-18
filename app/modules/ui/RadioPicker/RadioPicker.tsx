import { useState } from "react";
import { classNames } from "../styles";

interface Option<T extends unknown> {
  label: string;
  value: T;
}

// i === options.length - 1
//         selectedOption === option.value

export const getRadioStyle = (
  type: "transparent" | "solid",
  isSelected: boolean,
  location?: "first" | "last"
) => {
  if (type === "transparent") {
    return classNames(
      "my-1 mx-0 inline-flex cursor-pointer py-2 px-4 text-white text-sm uppercase border-b-2 border-white border-solid",
      `${
        isSelected
          ? "opacity-100 border-opacity-50"
          : "opacity-70 border-opacity-0"
      }`
    );
  } else {
    return classNames(
      "my-1 mx-0 inline-flex cursor-pointer py-2 px-4 text-white",
      location === "first"
        ? "rounded-l-lg"
        : location === "last"
        ? "rounded-r-lg"
        : "",
      `${isSelected ? "bg-black bg-opacity-50" : "bg-black bg-opacity-20"}`
    );
  }
};

export const RadioPicker = <T extends unknown>({
  options,
  handleChange,
  defaultValue,
  type,
}: {
  options: Option<T>[];
  handleChange: (s: T) => void;
  defaultValue: T;
  type?: "transparent";
}) => {
  const [selectedOption, setSelectedOption] = useState<T>(defaultValue);

  const handleOptionChange = (newVal: T) => {
    handleChange(newVal);
    setSelectedOption(newVal);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Filter By City, State, or National Bills"
      className="flex flex-row justify-center lg:justify-end"
    >
      {options.map((option, i) => (
        <div
          key={String(option.value)}
          role="radio"
          tabIndex={0}
          aria-checked={defaultValue === option.value}
          onClick={() => handleOptionChange(option.value as T)}
          className={getRadioStyle(
            type || "solid",
            option.value === selectedOption,
            i === 0 ? "first" : i === options.length - 1 ? "last" : undefined
          )}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};
