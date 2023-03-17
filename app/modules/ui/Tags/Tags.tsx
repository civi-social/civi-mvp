import { useState } from "react";
import { classNames } from "../styles";

export const Tag: React.FC<{ backgroundColor?: string; text: string }> = ({
  text,
}) => {
  return (
    <span
      className={classNames(baseTag, "bg-opacity-40 text-sm text-opacity-90")}
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
          className={classNames(
            baseTag,
            "bg-opacity-60 text-base text-opacity-90"
          )}
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

const baseTag =
  "px-3 py-1 m-1 mr-0 rounded-full border-none font-light bg-black text-white";
