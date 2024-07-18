import { useState } from "react";
import { classNames } from "../styles";

export const Tag: React.FC<{ className?: string; text: string }> = ({
  text,
  className,
}) => {
  let icon: string;
  let background: string;
  switch (text) {
    case "Climate Change":
      icon = "🌍";
      background = "bg-green-500";
      break;
    case "Health Care":
      icon = "🏥";
      background = "bg-blue-500";
      break;
    case "Education":
      icon = "🎓";
      background = "bg-yellow-500";
      break;
    case "Economy":
      icon = "💰";
      background = "bg-purple-500";
      break;
    case "Civil Rights":
      icon = "👥";
      background = "bg-red-500";
      break;
    case "Public Safety":
      icon = "🚓";
      background = "bg-indigo-500";
      break;
    case "Foreign Policy":
      icon = "🌐";
      background = "bg-pink-500";
      break;
    case "Democracy":
      icon = "🗳";
      background = "bg-gray-500";
      break;
    case "Transit":
      icon = "🚇";
      background = "bg-orange-500";
      break;
    case "States Rights":
      icon = "🏛";
      background = "bg-teal-500";
      break;
    case "Other":
    default:
      icon = "";
      background = "bg-black";
  }
  return (
    <span
      className={classNames(
        baseTag,
        "text-sm text-opacity-90",
        background,
        className || "bg-opacity-70 text-white"
      )}
    >
      {text} {icon}
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
    <div className="text-center lg:text-right">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={classNames(
            baseTag,
            "bg-black bg-opacity-50 text-base text-white text-opacity-90"
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

const baseTag = "px-3 py-1 m-1 mr-0 rounded-full border-none font-light";
