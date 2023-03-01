import { useState } from "react";
import type { Style, StyleHack } from "../styles";
import { Skin } from "../styles";

export const Tag: React.FC<{ backgroundColor?: string; text: string }> = ({
  backgroundColor,
  text,
}) => {
  return (
    <span
      style={{
        ...styles.tagMain,
        backgroundColor: backgroundColor
          ? backgroundColor
          : ("grey" as StyleHack),
        color: Skin.White,
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
    <div>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          style={{
            ...styles.tagMain,
            backgroundColor: selectedTags.includes(tag)
              ? ("blue" as StyleHack)
              : ("grey" as StyleHack),
            color: Skin.White,
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

const styles: Style.StyleSheet<"tagMain"> = {
  tagMain: {
    padding: "5px 10px" as StyleHack,
    margin: "5px 5px 5px 0" as StyleHack,
    borderRadius: "20px",
    border: "none",
    fontSize: "12px",
  },
};
