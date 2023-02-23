import type { FC } from "react";

type Props = {
  title?: string;
  subtitle?: string;
  channels: React.ReactNode;
};

export const ResultCard: FC<Props> = ({ title, subtitle, channels }) => {
  return (
    <div className="flex flex-col gap-y-2 rounded-lg border border-solid border-gray-200 px-4 py-2">
      <h4 className="text-xl font-semibold">{title}</h4>
      <p className="text-lg">{subtitle}</p>
      <ul className="flex list-none flex-wrap items-center gap-x-2">
        {channels}
      </ul>
    </div>
  );
};

export default ResultCard;
