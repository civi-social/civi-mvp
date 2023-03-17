import { useState } from "react";
import type { StyleHack } from "../styles";
import { classNames } from "../styles";

export const Tag: React.FC<{ backgroundColor?: string; text: string }> = ({
  backgroundColor,
  text,
}) => {
  return (
    <span
      className={classNames(baseTag, "text-sm font-normal text-white")}
      style={{
        backgroundColor: backgroundColor
          ? backgroundColor
          : ("#b1b1b1" as StyleHack),
      }}
    >
      {text}
    </span>
  );
};

export const Tagging = ({
  tags,
  selected,
  handleClick,
}: {
  tags: string[];
  selected: string[];
  handleClick: (updatedTags: string[]) => void;
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(selected ?? []);

  const handleTagClick = (tag: string) => {
    let updatedTags: string[] = [];
    if (selectedTags.includes(tag)) {
      updatedTags = selectedTags.filter((t) => t !== tag);
    } else {
      updatedTags = [...selectedTags, tag];
    }
    handleClick(updatedTags);
    setSelectedTags(updatedTags);
  };

  return (
    <div className="text-center">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={classNames(baseTag, "bg-black bg-opacity-70 text-white")}
          style={{
            opacity:
              selectedTags.includes(tag) || selectedTags.length === 0
                ? "1.0"
                : "0.3",
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

const baseTag = "px-2 py-1 m-1 mr-0 rounded-full border-none text-base";
