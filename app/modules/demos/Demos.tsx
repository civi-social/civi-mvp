import { useSearchParams } from "@remix-run/react";

export const useDemoContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const demoEnabled = searchParams.get("demo");

  const disableDemo = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("demo");
    setSearchParams(newSearchParams);
  };

  const enableDemo = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("demo", "true");
    setSearchParams(newSearchParams);
  };

  const demoWarnComponent = demoEnabled && (
    <div className="mt-2 flex items-center rounded-xl bg-primary p-4 text-white">
      <span>
        Showing demo voting content.{" "}
        <button
          className="underline"
          onClick={() => {
            disableDemo();
          }}
        >
          Disable
        </button>
      </span>
    </div>
  );
  return { demoEnabled, enableDemo, demoWarnComponent, disableDemo };
};

export const VotingDemo = () => {
  const { demoEnabled } = useDemoContent();
  if (!demoEnabled) {
    return <></>;
  }
  const yay = Math.floor(Math.random() * 991) + 10;
  const nay = Math.floor(Math.random() * 991) + 10;
  const present = Math.floor(Math.random() * 991) + 10;

  const localVotes = `Among those who share your rep, the votes are ${(
    yay * 0.2
  ).toFixed(0)} YAY, ${(nay * 0.2).toFixed(0)} NAY, and ${(
    present * 0.2
  ).toFixed(0)} PRESENT.`;
  return (
    <div
      className="tooltip tooltip-primary rounded text-right "
      data-tip={localVotes}
    >
      <span className="rounded-md border-2 border-black border-opacity-25 py-1 px-2 text-right">
        <span>YAY {yay}</span> |<span> NAY {nay}</span> |
        <span> PRESENT {present}</span>
      </span>
    </div>
  );
};
