import type { FC } from "react";

type Props = {
  title?: string;
  subtitle?: string;
  channels: React.ReactNode;
};

const ResultCard: FC<Props> = ({ title, subtitle, channels }) => {
  return (
    <div className="flex flex-col gap-y-2 px-4 py-2 rounded-lg border border-solid border-gray-200">
      <h4 className="text-xl font-semibold">
        {title}
      </h4>
      <p className="text-lg">{subtitle}</p>
      <ul className="list-none flex items-center flex-wrap gap-x-2">{channels}</ul>
    </div>
  );
};

export default ResultCard;
