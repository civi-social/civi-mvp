import { useSearchParams } from "@remix-run/react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { RepLevel } from "~/types";
import { levelKey } from "~/utils";

const LevelsNav: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const levelValue = searchParams.get(levelKey);
  const level =
    levelValue && Object.values(RepLevel).includes(levelValue as RepLevel)
      ? levelValue
      : RepLevel.City;
  const [activeLevel, setActiveLevel] = useState(level);

  useEffect(() => {
    setActiveLevel(level);
  }, [level]);

  return (
    <div className="flex w-full max-w-5xl justify-center border-b border-gray-200 dark:border-gray-700">
      <ul
        className="-mb-px flex flex-wrap text-center text-sm font-medium"
        role="tablist"
      >
        {Object.values(RepLevel).map((value) => (
          <li className="mr-2" role="presentation" key={value}>
            <button
              className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 capitalize ${
                value === activeLevel
                  ? "border-indigo-500 text-indigo-500"
                  : "hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              type="button"
              role="tab"
              aria-controls="profile"
              aria-selected="false"
              onClick={() => {
                const newSearchParams = new URLSearchParams(
                  searchParams.toString()
                );
                newSearchParams.set(levelKey, value);
                setSearchParams(newSearchParams);
              }}
            >
              {value}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LevelsNav;
