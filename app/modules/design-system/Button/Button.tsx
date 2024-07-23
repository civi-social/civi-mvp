import { classNames } from "../styles";

export const Button: React.FC<{
  onClick: () => void;
  className?: string;
  type?: "default" | "call-to-action";
}> = ({ onClick, children, className, type }) => {
  let typeClass = "";
  switch (type) {
    case "call-to-action":
      typeClass = "bg-green-500 hover:bg-green-700";
      break;
    case "default":
    default:
      typeClass = "bg-black bg-opacity-40 hover:bg-opacity-100";
      break;
  }

  console.log("TYPE CLASS", typeClass);

  return (
    <div
      role="button"
      className={classNames(
        "rounded px-4 py-2 text-base font-semibold text-white",
        typeClass,
        className
      )}
      onClick={() => {
        onClick();
      }}
    >
      {children}
    </div>
  );
};
